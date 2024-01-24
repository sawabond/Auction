using Auction.Application.AuctionHosting;
using Auction.Contracts.Auction.AuctionItem;
using Auction.Core.Common;
using Core;

namespace Auction.Application.Auction.AuctionItem.Bid;

public interface IBidService
{
    Task<Core.Auction.Entities.Bid> MakeBid(Guid auctionId, Guid userId, decimal bid);
}

public class BidService(IActiveAuctionsStorage _activeAuctionsStorage,
    IRepository<Core.Auction.Entities.AuctionItem> _repository,
    IPublisher _publisher) : IBidService
{
    private readonly object _lock = new();
    
    public async Task<Core.Auction.Entities.Bid> MakeBid(Guid auctionId, Guid userId, decimal bid)
    {
        var auction = await _activeAuctionsStorage.GetAsync(auctionId);
        if (auction is null)
        {
            return Core.Auction.Entities.Bid.NullBid;
        }

        var currentItem = auction.CurrentlySellingItem;
        if (currentItem is null)
        {
            return Core.Auction.Entities.Bid.NullBid;
        }

        var oldPrice = currentItem.ActualPrice;

        Core.Auction.Entities.Bid lastBid;
        lock (_lock)
        {
            lastBid = currentItem.AddBid(userId, bid, DateTime.UtcNow);
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

        return lastBid;
    }
}