using Microsoft.EntityFrameworkCore;
using Payment.Infrastructure;

namespace Payment.Application.Balance;

public interface IBalanceService
{
    Task<Core.Balance?> GetUserBalance(Guid id);
}

public class BalanceService(PaymentDbContext _context) : IBalanceService
{
    public async Task<Core.Balance?> GetUserBalance(Guid id)
    {
        // TODO: Add caching
        return await _context.Balances.SingleOrDefaultAsync(x => x.UserId == id);
    }
}