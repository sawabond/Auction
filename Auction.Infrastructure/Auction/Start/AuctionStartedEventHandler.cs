using Auction.Contracts.Auction;
using KafkaFlow;
using Microsoft.Extensions.Logging;

namespace Auction.Infrastructure.Auction.Start;

public class AuctionStartedEventHandler(ILogger<AuctionStartedEventHandler> _logger) 
    : IMessageHandler<AuctionStartedEvent>
{
    public Task Handle(IMessageContext context, AuctionStartedEvent message)
    {
        _logger.LogInformation($"Auction with id {message.Id} has started at {message.StartTime}.");

        return Task.CompletedTask;
    }
}