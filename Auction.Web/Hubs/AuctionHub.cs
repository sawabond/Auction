using Auction.Application.AuctionHosting;
using Auction.Contracts.Auction.AuctionItem;
using Auction.Core.Auction.Entities;
using Auction.Core.Common;
using Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace Auction.Web.Hubs;

[Authorize]
public class AuctionHub(
    IActiveAuctionsStorage _activeAuctionsStorage,
    IRepository<AuctionItem> _repository,
    IPublisher _publisher) : Hub
{
    private readonly object _lock = new();

    public async Task MakeBid(string auctionId, decimal bid)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, auctionId);

        var auctionIdGuid = Guid.Parse(auctionId);
        var auction = await _activeAuctionsStorage.GetAsync(auctionIdGuid);
        if (auction is null)
        {
            return;
        }

        var currentItem = auction.CurrentlySellingItem;
        if (currentItem is null)
        {
            return;
        }

        var oldPrice = currentItem.ActualPrice;

        Bid lastBid;
        lock (_lock)
        {
            lastBid = currentItem.AddBid(Guid.Parse(Context.UserIdentifier!), bid, DateTime.UtcNow);
        }
        await _repository.UpdateAsync(currentItem);

        await _publisher.Publish(currentItem.Id, new AuctionItemGotBiddedEvent
        {
            AuctionItemId = currentItem.Id,
            AuctionId = auction.Id,
            Bid = bid,
            BiddedAt = lastBid.Date,
            UserId = lastBid.UserId,
            NewPrice = currentItem.ActualPrice,
            OldPrice = oldPrice
        });
        
        await Clients.Groups(auctionId).SendAsync("BidMade", JsonConvert.SerializeObject(lastBid));
    }
}