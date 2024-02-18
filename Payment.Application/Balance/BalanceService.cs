using Core;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Payment.Application.Balance.Specifications;
using Payment.Contracts.Balance;

namespace Payment.Application.Balance;

public interface IBalanceService
{
    ValueTask<Core.Balance?> GetUserBalance(Guid id);
    Task<(Core.Balance Source, Core.Balance Target)> Transfer(Guid sourceUserId, Guid targetUserId, decimal amount);
    Task<Core.Balance> CreateNewBalance(Guid userId);
}

public class BalanceService(
    IDistributedCache _cache,
    ILogger<BalanceService> _logger,
    IRepository<Core.Balance> _repository,
    IPublisher _publisher) : IBalanceService
{
    public async ValueTask<Core.Balance?> GetUserBalance(Guid id)
    {
        // Read aside implementation
        var cachedBalance = _cache.GetString($"balance_{id}");
        if (!string.IsNullOrWhiteSpace(cachedBalance))
        {
            return JsonConvert.DeserializeObject<Core.Balance>(cachedBalance);
        }
        
        var balance = await _repository.GetByIdAsync(id);
        if (balance != null)
        {
            await _cache.SetStringAsync($"balance_{id}", JsonConvert.SerializeObject(balance), 
                new DistributedCacheEntryOptions()
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
            });
        }

        return balance;
    }
    
    public async Task<Core.Balance> CreateNewBalance(Guid userId)
    {
        var balance = new Core.Balance
        {
            UserId = userId,
            Amount = 0
        };
        await _repository.AddAsync(balance);
        await _repository.SaveChangesAsync();
        return balance;
    }

    public async Task<(Core.Balance Source, Core.Balance Target)> Transfer(Guid sourceUserId, Guid targetUserId, decimal amount)
    {
        _logger.LogInformation("Started transferring {Amount} from {SourceUserId} to {TargetUserId}", 
            amount, sourceUserId, targetUserId);
        
        // TODO: Add transaction
        
        var balance = await _repository.ListAsync(new BalancesByUserIdsSpec(sourceUserId, targetUserId));
        var sourceBalance = balance.Single(x => x.UserId == sourceUserId);
        var targetBalance = balance.Single(x => x.UserId == targetUserId);
        
        sourceBalance.Amount -= amount;
        targetBalance.Amount += amount;
        
        await _repository.SaveChangesAsync();
        // invalidate cache
        await _cache.RemoveAsync($"balance_{sourceBalance.UserId}");
        await _cache.RemoveAsync($"balance_{targetBalance.UserId}");
        
        _logger.LogInformation("Saved balance changes to database from {SourceUserId} to {TargetUserId} for {Amount}", 
            sourceUserId, targetUserId, amount);

        await _publisher.Publish(sourceUserId, new BalanceChangedEvent
        {
            UserId = sourceUserId,
            Delta = -amount,
            CurrentBalance = sourceBalance.Amount,
            Reason = $"Transfer to {targetUserId}",
            CreatedAt = DateTime.UtcNow
        });
        await _publisher.Publish(targetUserId, new BalanceChangedEvent
        {
            UserId = targetUserId,
            Delta = amount,
            CurrentBalance = targetBalance.Amount,
            Reason = $"Transfer from {sourceUserId}",
            CreatedAt = DateTime.UtcNow
        });
        
        _logger.LogInformation("Published BalanceChangedEvent for {SourceUserId} and {TargetUserId} for {Amount}", 
            sourceUserId, targetUserId, amount);
        
        return (sourceBalance, targetBalance);
    }
}