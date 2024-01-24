namespace Auction.Application.Auction.AuctionItem.Bid;

public interface IAuctionSubscriber
{
    public Task BidMade(Core.Auction.Entities.Bid bid);
    public Task OnAuctionRunning(Core.Auction.Entities.Auction auction);
}