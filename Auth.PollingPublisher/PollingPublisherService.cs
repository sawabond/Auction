using Auth.Infrastructure;
using Core;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Auth.PollingPublisher;

public class PollingPublisherService : IHostedService, IDisposable
{
    private readonly IServiceScopeFactory _factory;
    private Timer _timer;

    public PollingPublisherService(IServiceScopeFactory factory)
    {
        _factory = factory;
    }
    

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromSeconds(3));

        return Task.CompletedTask;
    }

    private async void DoWork(object state)
    {
        using var scope = _factory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
        var publisher = scope.ServiceProvider.GetRequiredService<IPublisher>();
        
        var messages = await context.OutboxMessages
            .Where(x => x.ProcessedAt == null)
            .OrderBy(x => x.OccurredOn)
            .ToListAsync();

        foreach (var message in messages)
        {
            await publisher.Publish(message.Key, message.Event);
            message.ProcessedAt = DateTime.UtcNow;
            context.OutboxMessages.Update(message);
            await context.SaveChangesAsync();
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}