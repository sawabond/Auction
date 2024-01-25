using Auction.Contracts.Auction;
using Core;
using Hangfire;
using KafkaFlow;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Auction.Infrastructure.Auction.Create;

public class AuctionCreatedEventHandler(
    ILogger<AuctionCreatedEventHandler> _logger,
    Ibuilder.ServicescopeFactory _factory,
    IScheduler _scheduler)
    : IMessageHandler<AuctionCreatedEvent>
{
    public async Task Handle(IMessageContext context, AuctionCreatedEvent message)
    {
        _logger.LogInformation("Auction created event received {@Event}.", message);
        var timeLeftToAuctionStartSinceNow = message.StartTime - DateTime.UtcNow;

        _logger.LogInformation("Scheduling auction {AuctionId} to run in {@TimeLeftToAuctionStartSinceNow}.", message.Id, timeLeftToAuctionStartSinceNow);
        await _scheduler.Schedule(() => PublishAuctionStartedEvent(message), timeLeftToAuctionStartSinceNow);
    }
    
    public async Task PublishAuctionStartedEvent(AuctionCreatedEvent message)
    {
        using var scope = _factory.CreateScope();
        var publisher = scope.ServiceProvider.GetRequiredService<IPublisher>();
        
        var auctionStartedEvent = new AuctionStartedEvent
        { 
            Id = message.Id,
            StartTime = message.StartTime,
        };

        _logger.LogInformation("Publishing auction started event for auction {AuctionId}", message.Id);

        await publisher.Publish(auctionStartedEvent.Id, auctionStartedEvent);
    }
}