using Auction.Application.Auction;
using Auction.Application.Auction.AuctionItem.Bid;
using Auction.Application.AuctionHosting;
using Auction.Contracts.Auction;
using Auction.Infrastructure.Auction.Hubs;
using KafkaFlow;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Auction.Infrastructure.Auction.Start;

public class AuctionStartedEventHandler(
    ILogger<AuctionStartedEventHandler> _logger,
    IAuctionsHost _host) 
    : IMessageHandler<AuctionStartedEvent>
{
    public async Task Handle(IMessageContext context, AuctionStartedEvent message)
    {
        
    }
}