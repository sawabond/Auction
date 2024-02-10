using Microsoft.EntityFrameworkCore.Storage;

namespace Auth.Core.Common;

public interface ITransactionFactory
{
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);
}