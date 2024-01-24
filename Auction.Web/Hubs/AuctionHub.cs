using Auction.Application.Auction.AuctionItem.Bid;
using Auction.Application.AuctionHosting;
using Auction.Core.Auction.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Auction.Web.Hubs;

[Authorize]
public class AuctionHub(
    IActiveAuctionsStorage _activeAuctionsStorage,
    IBidService _bidService) : Hub<IAuctionSubscriber>
{
    public async Task MakeBid(string auctionId, decimal bid)
    {
        var lastBid = await _bidService.MakeBid(Guid.Parse(auctionId), Guid.Parse(Context.UserIdentifier!), bid);
        if (lastBid.Equals(Bid.NullBid))
        {
            return;
        }
        
        await Clients.Groups(auctionId).BidMade(lastBid);
    }

    public async Task JoinGroup(string auctionId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, auctionId);
        
        var auction = await _activeAuctionsStorage.GetAsync(Guid.Parse(auctionId));
        await Clients.Groups(auctionId).OnAuctionRunning(auction);
    }
}