using Auction.Contracts.Auction;
using Auction.Contracts.Auction.AuctionItem;
using Core;
using Hangfire;
using KafkaFlow;
using Microsoft.Extensions.Logging;

namespace Auction.Infrastructure.Auction.Create;

public class AuctionCreatedEventHandler(
    ILogger<AuctionCreatedEventHandler> _logger,
    IPublisher _publisher)
    : IMessageHandler<AuctionCreatedEvent>
{
    public async Task Handle(IMessageContext context, AuctionCreatedEvent message)
    {
        
    }
}