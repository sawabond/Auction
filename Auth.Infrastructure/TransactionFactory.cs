using Auth.Core.Common;
using Microsoft.EntityFrameworkCore.Storage;

namespace Auth.Infrastructure;

public class TransactionFactory(AuthDbContext _context) : ITransactionFactory
{
    public async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Database.BeginTransactionAsync(cancellationToken);
    }
}