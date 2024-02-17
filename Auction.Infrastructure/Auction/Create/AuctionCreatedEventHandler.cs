using Auction.Application.Auction;
using Auction.Application.AuctionHosting;
using Auction.Contracts.Auction;
using Auction.Infrastructure.Auction.Hubs;
using Core;
using Hangfire;
using KafkaFlow;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Auction.Infrastructure.Auction.Create;

public class AuctionCreatedEventHandler(
    ILogger<AuctionCreatedEventHandler> _logger,
    IServiceScopeFactory _factory,
    IScheduler _scheduler,
    IAuctionsHost _host)
    : IMessageHandler<AuctionCreatedEvent>
{
    public async Task Handle(IMessageContext context, AuctionCreatedEvent auctionCreatedMessage)
    {
        _logger.LogInformation("Auction created event received {@Event}.", auctionCreatedMessage);
        var timeLeftToAuctionStartSinceNow = auctionCreatedMessage.StartTime - DateTime.UtcNow;

        _logger.LogInformation("Scheduling auction {AuctionId} to run in {@TimeLeftToAuctionStartSinceNow}.", auctionCreatedMessage.Id, timeLeftToAuctionStartSinceNow);

        if (timeLeftToAuctionStartSinceNow < TimeSpan.Zero)
        {
            timeLeftToAuctionStartSinceNow = TimeSpan.FromSeconds(3);
        }
        await _scheduler.Schedule(() => StartAuction(auctionCreatedMessage), timeLeftToAuctionStartSinceNow);
    }
    
    public async Task StartAuction(AuctionCreatedEvent message)
    {
        using var scope = _factory.CreateScope();
        var publisher = scope.ServiceProvider.GetRequiredService<IPublisher>();
        var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<AuctionHub>>();
        
        _logger.LogInformation("Auction started event received {@Event}", message);

        var auction = await _host.StartAuctionById(message.Id);
        await hubContext.Clients.Groups(auction.Id.ToString())
            .SendAsync("OnAuctionRunning", auction.ToViewModel());
        
        var auctionStartedEvent = new AuctionStartedEvent
        { 
            Id = message.Id,
            StartTime = message.StartTime,
        };
        _logger.LogInformation("Publishing auction started event for auction {AuctionId}", message.Id);
        await publisher.Publish(auctionStartedEvent.Id, auctionStartedEvent);
    }
}