using Auction.Application.AuctionHosting;
using Auction.Contracts.Auction;
using Auction.Contracts.Auction.AuctionItem;
using Auction.Core.Common;
using Core;
using Hangfire;
using KafkaFlow;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Auction.Infrastructure.Auction.AuctionItem;

public class AuctionItemStartedSellingEventHandler(
    ILogger<AuctionItemStartedSellingEventHandler> _logger,
    IActiveAuctionsStorage _activeAuctionsStorage,
    IServiceScopeFactory _scopeFactory)
    : IMessageHandler<AuctionItemStartedSellingEvent>
{
    public async Task Handle(IMessageContext context, AuctionItemStartedSellingEvent message)
    {
        using var scope = _scopeFactory.CreateScope();
        var scheduler = scope.ServiceProvider.GetRequiredService<IScheduler>();

        _logger.LogInformation("Item started selling event received {@Event}", message);

        await scheduler.Schedule(() => SellItem(message.AuctionId), message.SellingPeriod);
    }

    [AutomaticRetry(Attempts = 0)]
    public async Task SellItem(Guid auctionId)
    {
        using var scope = _scopeFactory.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IRepository<Core.Auction.Entities.Auction>>();
        var publisher = scope.ServiceProvider.GetRequiredService<IPublisher>();
        
        var auction = await _activeAuctionsStorage.GetAsync(auctionId);
        var soldItem = auction.CurrentlySellingItem;
        _logger.LogInformation("Selling current item {Item} for Auction {AuctionId}", soldItem, auction.Id);
        
        _logger.LogInformation("Setting next selling item for Auction {AuctionId}", auction.Id);
        var nextAuctionItemWasSet = auction.SetNextItem();
        _logger.LogInformation("Next selling item setting result was {ItemWasSet}", nextAuctionItemWasSet);
        
        await repository.UpdateAsync(auction);
        await publisher.Publish(auction.Id, new AuctionItemSoldEvent
        {
            Id = soldItem.Id,
            AuctionId = auction.Id,
            LastPrice = soldItem.ActualPrice,
            UserId = soldItem.Bids?.LastOrDefault()?.UserId,
            SoldAt = DateTime.UtcNow
        });
        _logger.LogInformation("Publishing AuctionItemSoldEvent for item {ItemId}", soldItem.Id);
        
        if (nextAuctionItemWasSet)
        {
            if (auction.CurrentlySellingItem is not null)
            {
                _logger.LogInformation("Publishing new selling item event AuctionItemStartedSellingEvent for item {ItemId}", auction.CurrentlySellingItem);

                await publisher.Publish(auction.Id, new AuctionItemStartedSellingEvent
                {
                    Id = auction.CurrentlySellingItem.Id,
                    AuctionId = auction.Id,
                    StartedAt = DateTime.UtcNow,
                    SellingPeriod = auction.CurrentlySellingItem.SellingPeriod,
                });
                
                return;
            }
            
            _logger.LogInformation("No more items to sell for Auction {AuctionId}", auction.Id);
            _logger.LogInformation("Publishing AuctionClosedEvent for Auction {AuctionId}", auction.Id);
            await publisher.Publish(auction.Id, new AuctionClosedEvent
            {
                Id = auction.Id,
                ClosedAt = DateTime.UtcNow
            });
        }
    }
}