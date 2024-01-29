using Auction.Application.Auction.AuctionItem.Bid;
using Auction.Application.AuctionHosting;
using Auction.Contracts.Auction;
using Auction.Contracts.Auction.AuctionItem;
using Auction.Infrastructure.Auction.Hubs;
using Core;
using KafkaFlow;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Auction.Infrastructure.Auction.AuctionItem;

public class AuctionItemSoldEventHandler(
    ILogger<AuctionItemSoldEventHandler> logger,
    IActiveAuctionsStorage activeAuctionsStorage,
    IServiceScopeFactory scopeFactory,
    IHubContext<AuctionHub, IAuctionSubscriber> _hubContext)
    : IMessageHandler<AuctionItemSoldEvent>
{
    public async Task Handle(IMessageContext context, AuctionItemSoldEvent message)
    {
        await _hubContext.Clients
            .Groups(message.AuctionId.ToString())
            .ItemSold(new
        {
            message.LastPrice,
            message.Id,
            message.UserId,
            message.SoldAt
        });
    }
}