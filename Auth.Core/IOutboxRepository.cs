using Core;

namespace Auth.Core;

public interface IOutboxRepository
{
    Task AddAsync(object key, IEvent @event, CancellationToken cancellationToken = default);
}