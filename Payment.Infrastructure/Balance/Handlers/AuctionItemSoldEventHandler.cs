using Auction.Contracts.Auction.AuctionItem;
using Core;
using KafkaFlow;
using Microsoft.Extensions.DependencyInjection;
using Payment.Application.Balance;
using Payment.Contracts.Balance;

namespace Payment.Infrastructure.Balance.Handlers;

public class AuctionItemSoldEventHandler(
    IServiceScopeFactory _serviceScopeFactory)
    : IMessageHandler<AuctionItemSoldEvent>
{
    public async Task Handle(IMessageContext context, AuctionItemSoldEvent message)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var balanceService = scope.ServiceProvider.GetRequiredService<IBalanceService>();
        var publisher = scope.ServiceProvider.GetRequiredService<IPublisher>();
        
        if (message.UserId.HasValue)
        {
            var currentBalance = await balanceService.Withdraw(message.UserId.Value, message.LastPrice);
            await publisher.Publish(message.UserId.Value, new BalanceChangedEvent
            {
                UserId = message.UserId.Value,
                Delta = -message.LastPrice,
                CurrentBalance = currentBalance.Amount,
                Reason = $"Auction item {message.Id} bought",
                CreatedAt = DateTime.UtcNow
            });
        }
    }
}