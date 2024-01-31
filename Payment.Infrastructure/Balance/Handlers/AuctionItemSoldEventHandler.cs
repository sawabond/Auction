using Auction.Contracts.Auction.AuctionItem;
using KafkaFlow;
using Microsoft.Extensions.DependencyInjection;
using Payment.Application.Balance;

namespace Payment.Infrastructure.Balance.Handlers;

public class AuctionItemSoldEventHandler(IServiceScopeFactory _scopeFactory)
    : IMessageHandler<AuctionItemSoldEvent>
{
    public async Task Handle(IMessageContext context, AuctionItemSoldEvent message)
    {
        if (message.UserId.HasValue)
        {
            using var scope = _scopeFactory.CreateScope();
            var balanceService = scope.ServiceProvider.GetRequiredService<IBalanceService>();
            await balanceService.Transfer(message.UserId.Value, message.AuctionOwnerId, message.LastPrice);
        }
    }
}