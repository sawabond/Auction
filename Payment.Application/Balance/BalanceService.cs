using Core;

namespace Payment.Application.Balance;

public interface IBalanceService
{
    Task<Core.Balance?> GetUserBalance(Guid id);
    Task<Core.Balance> Withdraw(Guid userId, decimal amount);
}

public class BalanceService(IRepository<Core.Balance> _repository) : IBalanceService
{
    public async Task<Core.Balance?> GetUserBalance(Guid id)
    {
        // TODO: Add caching
        return await _repository.GetByIdAsync(id);
    }

    public async Task<Core.Balance> Withdraw(Guid userId, decimal amount)
    {
        var balance = await _repository.GetByIdAsync(userId);
        
        balance.Amount -= amount;
        
        await _repository.SaveChangesAsync();
        return balance;
    }
}