using Auction.Contracts.Auction;

namespace Auction.Application.Auction.AuctionItem.Bid;

public interface IAuctionSubscriber
{
    public Task BidMade(Core.Auction.Entities.Bid bid);
    public Task BidFailed(string reason);
    public Task OnAuctionRunning(Core.Auction.Entities.Auction auction);
    public Task ItemSold(object item);
    public Task AuctionClosed(AuctionClosedEvent auctionClosedEvent);
}