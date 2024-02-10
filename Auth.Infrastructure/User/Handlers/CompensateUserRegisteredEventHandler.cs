using Auth.Contracts.User;
using KafkaFlow;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Auth.Infrastructure.User.Handlers;

public class CompensateUserRegisteredEventHandler(IServiceScopeFactory _scopeFactory)
    : IMessageHandler<CompensateUserRegisteredEvent>
{
    public async Task Handle(IMessageContext context, CompensateUserRegisteredEvent message)
    {
        var scope = _scopeFactory.CreateScope();
        var ctx = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
        
        await ctx.Users
            .Where(x => x.Id == message.Id.ToString())
            .ExecuteDeleteAsync();
    }
}