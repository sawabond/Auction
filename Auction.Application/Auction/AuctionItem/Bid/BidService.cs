using Auction.Application.AuctionHosting;
using Auction.Contracts.Auction.AuctionItem;
using Core;
using FluentResults;
using Payment.Contracts.Clients;

namespace Auction.Application.Auction.AuctionItem.Bid;

public interface IBidService
{
    Task<Result<Core.Auction.Entities.Bid>> MakeBid(Guid auctionId, Guid userId, decimal bid);
}

public class BidService(IActiveAuctionsStorage _activeAuctionsStorage,
    IRepository<Core.Auction.Entities.AuctionItem> _repository,
    IPublisher _publisher,
    IPaymentClient _paymentClient) : IBidService
{
    private readonly object _lock = new();
    
    public async Task<Result<Core.Auction.Entities.Bid>> MakeBid(Guid auctionId, Guid userId, decimal bid)
    {
        var balance = await _paymentClient.GetBalanceAsync(userId);
        if (balance.Amount < bid)
        {
            return Result.Fail($"User {userId} does not have enough money to make bid {bid}");
        }
        
        var auction = await _activeAuctionsStorage.GetAsync(auctionId);
        if (auction is null)
        {
            return Result.Fail($"Auction with id {auctionId} does not exist or is not running");
        }

        var currentItem = auction.CurrentlySellingItem;
        if (currentItem is null)
        {
            return Result.Fail($"Auction with id {auctionId} does not have currently selling item");
        }

        var oldPrice = currentItem.ActualPrice;
        
        if (bid - currentItem.ActualPrice < currentItem.MinimalBid)
        {
            return Result.Fail($"Bid {bid} for auction {auctionId} does not satisfy minimal bid {currentItem.MinimalBid}");
        }

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