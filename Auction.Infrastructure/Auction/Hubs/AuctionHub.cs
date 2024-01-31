using Auction.Application.Auction;
using Auction.Application.Auction.AuctionItem.Bid;
using Auction.Application.AuctionHosting;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Auction.Infrastructure.Auction.Hubs;

[Authorize]
public class AuctionHub(
    IActiveAuctionsStorage _activeAuctionsStorage,
    IBidService _bidService) : Hub<IAuctionSubscriber>
{
    public async Task MakeBid(string auctionId, decimal bid)
    {
        var lastBid = await _bidService.MakeBid(Guid.Parse(auctionId), Guid.Parse(Context.UserIdentifier!), bid);
        if (lastBid.IsFailed)
        {
            await Clients.User(Context.UserIdentifier!).BidFailed(string.Join(Environment.NewLine, lastBid.Errors.Select(x => x.Message)));
            return;
        }
        
        await Clients.Groups(auctionId).BidMade(lastBid.Value.ToViewModel());
    }

    public async Task JoinGroup(string auctionId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, auctionId);
        
        var auction = await _activeAuctionsStorage.GetAsync(Guid.Parse(auctionId));
        if (auction is null || auction.CurrentlySellingItem is null)
        {
            return;
        }
        
        await Clients.Groups(auctionId).OnAuctionRunning(auction?.ToViewModel());
    }
}