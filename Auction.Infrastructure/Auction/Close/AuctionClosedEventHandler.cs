using Auction.Application.Auction.AuctionItem.Bid;
using Auction.Application.AuctionHosting;
using Auction.Contracts.Auction;
using Auction.Infrastructure.Auction.AuctionItem;
using Auction.Infrastructure.Auction.Hubs;
using Core;
using KafkaFlow;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Auction.Infrastructure.Auction.Close;

public class AuctionClosedEventHandler(
    ILogger<AuctionItemSoldEventHandler> _logger,
    IActiveAuctionsStorage _activeAuctionsStorage,
    IServiceScopeFactory _scopeFactory,
    IHubContext<AuctionHub, IAuctionSubscriber> _hubContext)
    : IMessageHandler<AuctionClosedEvent>
{
    public async Task Handle(IMessageContext context, AuctionClosedEvent message)
    {
        using var scope = _scopeFactory.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IRepository<Core.Auction.Entities.Auction>>();

        var auction = await _activeAuctionsStorage.GetAsync(message.Id);
        
        auction.EndTime = DateTime.UtcNow;
        auction.AuctionItems[^1].IsSellingNow = false;
        await repository.UpdateAsync(auction);
        
        await _activeAuctionsStorage.Remove(message.Id);
        await _hubContext.Clients
            .Groups(message.Id.ToString())
            .AuctionClosed(message);
    }
}