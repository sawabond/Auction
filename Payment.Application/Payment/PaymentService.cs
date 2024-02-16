using Core;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Payment.Application.Balance;
using Payment.Contracts.Balance;
using Stripe;
using Stripe.Checkout;

namespace Payment.Application.Payment;

public interface IPaymentService
{
    Task<Result> CreatePaymentAsync(Guid userId, string sessionId);
}

public class PaymentService(
    IDistributedCache _cache,
    IBalanceService _balanceService,
    IRepository<Core.Payment> _paymentRepository,
    IRepository<Core.Balance> _balanceRepository,
    IPublisher _publisher,
    IStripeClient _stripeClient) : IPaymentService
{
    public async Task<Result> CreatePaymentAsync(Guid userId, string sessionId)
    {
        var sessionService = new SessionService(_stripeClient);
        var session = await sessionService.GetAsync(sessionId);
        if (session.PaymentStatus != "paid")
        {
            return Result.Fail("Session status is not 'paid'");
        }
        
        var decimalAmount = session.AmountTotal!.Value / 100;
        
        // TODO: refactor repository to use transactions
        
        await _paymentRepository.AddAsync(new()
        {
            Amount = decimalAmount,
            CreatedAt = DateTime.UtcNow,
            UserId = userId,
            SessionId = sessionId
        });
        
        var balance = await _balanceService.GetUserBalance(userId);
        if (balance is not null)
        {
            try
            {
                balance.Amount += decimalAmount;
                await _balanceRepository.UpdateAsync(balance);
            }
            catch (DbUpdateException ex)
            {
                await _cache.RemoveAsync($"balance_{userId}");
                
                // Retry a few times, then publish that payment failed
                throw;
            }
        }
        else
        {
            await _balanceRepository.AddAsync(new()
            {
                UserId = userId,
                Amount = decimalAmount
            });
        }
        
        await _paymentRepository.SaveChangesAsync();
        await _balanceRepository.SaveChangesAsync();
        await _cache.RemoveAsync($"balance_{userId}");

        //await transaction.CommitAsync();
        await _publisher.Publish(userId, new BalanceChangedEvent
        {
            UserId = userId,
            CurrentBalance = balance?.Amount + decimalAmount ?? decimalAmount,
            Reason = "Top-Up",
            Delta = decimalAmount,
            CreatedAt = DateTime.UtcNow,
        });

        return Result.Ok();
    }
    
    
}