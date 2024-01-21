using Auction.Application.AuctionHosting;
using Auction.Contracts.Auction;
using KafkaFlow;
using Microsoft.Extensions.Logging;

namespace Auction.Infrastructure.Auction.Start;

public class AuctionStartedEventHandler(
    ILogger<AuctionStartedEventHandler> _logger,
    IAuctionsHost _host) 
    : IMessageHandler<AuctionStartedEvent>
{
    public async Task Handle(IMessageContext context, AuctionStartedEvent message)
    {
        _logger.LogInformation("Auction started event received {@Event}", message);

        await _host.StartAuctionById(message.Id);
    }
}