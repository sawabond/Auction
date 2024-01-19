using Auction.Contracts.Auction;
using KafkaFlow;
using Microsoft.Extensions.Logging;

namespace Auction.Infrastructure.Auction.Create;

public class AuctionCreatedEventHandler(ILogger<AuctionCreatedEventHandler> _logger)
    : IMessageHandler<AuctionCreatedEvent>
{
    public async Task Handle(IMessageContext context, AuctionCreatedEvent message)
    {
        _logger.LogInformation("Received event {@Event} at {Time}", message, context.ConsumerContext.MessageTimestamp);
    }
}