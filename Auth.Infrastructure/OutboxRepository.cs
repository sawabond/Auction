using Auth.Core;
using Core;
using Newtonsoft.Json;

namespace Auth.Infrastructure;

public class OutboxRepository(AuthDbContext _context) : IOutboxRepository
{
    public async Task AddAsync(object key, IEvent @event, CancellationToken cancellationToken = default)
    {
        _context.OutboxMessages.Add(new OutboxMessage
        {
            Key = key,
            Id = Guid.NewGuid(),
            Type = @event.GetType().AssemblyQualifiedName,
            Event = @event,
            OccurredOn = DateTime.UtcNow
        });
        await _context.SaveChangesAsync(cancellationToken);
    }
}