using Auction.Application.AuctionHosting;
using Auction.Contracts.Auction;
using Auction.Contracts.Auction.AuctionItem;
using Auction.Core.Common;
using Core;
using KafkaFlow;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Auction.Infrastructure.Auction.AuctionItem;

public class AuctionItemSoldEventHandler(
    ILogger<AuctionItemSoldEventHandler> logger,
    IActiveAuctionsStorage activeAuctionsStorage,
    Ibuilder.ServicescopeFactory scopeFactory)
    : IMessageHandler<AuctionItemSoldEvent>
{
    public async Task Handle(IMessageContext context, AuctionItemSoldEvent message)
    {
        // using var scope = scopeFactory.CreateScope();
        // var repository = scope.ServiceProvider.GetRequiredService<IRepository<Core.Auction.Entities.Auction>>();
        // var publisher = scope.ServiceProvider.GetRequiredService<IPublisher>();
        //
        // logger.LogInformation("Item started selling event received {@Event}", message);
        //
        // var auction = await activeAuctionsStorage.GetAsync(message.AuctionId);
        //
        // var hasNextItem = auction.SetNextItem();
        //
        // if (hasNextItem)
        // {
        //     await repository.UpdateAsync(auction);
        //     await publisher.Publish(auction.Id, new AuctionItemStartedSellingEvent
        //     {
        //         Id = auction.CurrentlySellingItem.Id,
        //         AuctionId = auction.Id,
        //         StartedAt = DateTime.UtcNow,
        //         SellingPeriod = auction.CurrentlySellingItem.SellingPeriod,
        //     });
        //     
        //     return;
        // }
        //
        // await repository.UpdateAsync(auction);
        // await publisher.Publish(auction.Id, new AuctionClosedEvent
        // {
        //     Id = auction.Id,
        //     ClosedAt = DateTime.UtcNow
        // });
    }
}