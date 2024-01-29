using Auction.Contracts.Auction;

namespace Auction.Application.Auction.AuctionItem.Bid;

public interface IAuctionSubscriber
{
    public Task BidMade(BidViewModel bid);
    public Task BidFailed(string reason);
    public Task OnAuctionRunning(AuctionViewModel auction);
    public Task ItemSold(object item);
    public Task AuctionClosed(AuctionClosedEvent auctionClosedEvent);
}