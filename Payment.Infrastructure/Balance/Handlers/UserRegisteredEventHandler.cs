using Auth.Contracts.User;
using Core;
using KafkaFlow;
using Microsoft.Extensions.DependencyInjection;
using Payment.Application.Balance;
using Payment.Contracts.Balance;

namespace Payment.Infrastructure.Balance.Handlers;

public class UserRegisteredEventHandler(IServiceScopeFactory _scopeFactory)
    : IMessageHandler<UserRegisteredEvent>
{
    public async Task Handle(IMessageContext context, UserRegisteredEvent message)
    {
        using var scope = _scopeFactory.CreateScope();
        var balanceService = scope.ServiceProvider.GetRequiredService<IBalanceService>();
        await balanceService.CreateNewBalance(message.Id);
        
        var publisher = scope.ServiceProvider.GetRequiredService<IPublisher>();
        await publisher.Publish(message.Id, new BalanceChangedEvent
        {
            UserId = message.Id,
            CreatedAt = DateTime.UtcNow,
            CurrentBalance = 0,
            Delta = 0,
            Reason = "Balance created"
        });
    }
}