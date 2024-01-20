using Auction.Contracts.Auction;
using Core;
using Hangfire;
using KafkaFlow;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Auction.Infrastructure.Auction.Create;

public class AuctionCreatedEventHandler(
    ILogger<AuctionCreatedEventHandler> _logger,
    IServiceScopeFactory _factory)
    : IMessageHandler<AuctionCreatedEvent>
{
    public async Task Handle(IMessageContext context, AuctionCreatedEvent message)
    {
        var timeLeftToAuctionStartSinceNow = message.StartTime - DateTime.UtcNow;

        BackgroundJob.Schedule(() => PublishAuctionStartedEvent(message), timeLeftToAuctionStartSinceNow);
    }
    
    [AutomaticRetry(Attempts = 3)]
    public async Task PublishAuctionStartedEvent(AuctionCreatedEvent message)
    {
        using var scope = _factory.CreateScope();
        var publisher = scope.ServiceProvider.GetRequiredService<IPublisher>();
        
        var auctionStartedEvent = new AuctionStartedEvent
        { 
            Id = message.Id,
            StartTime = message.StartTime,
        };

        await publisher.Publish(auctionStartedEvent.Id, auctionStartedEvent);
    }
}