using FluentResults;
using Microsoft.EntityFrameworkCore;
using Payment.Infrastructure;
using Stripe;
using Stripe.Checkout;

namespace Payment.Application.Payment;

public interface IPaymentService
{
    Task<Result> CreatePaymentAsync(Guid userId, string sessionId);
}

public class PaymentService(PaymentDbContext _context, IStripeClient _stripeClient) : IPaymentService
{
    // TODO: refactor this method to user repositories
    public async Task<Result> CreatePaymentAsync(Guid userId, string sessionId)
    {
        var sessionService = new SessionService(_stripeClient);
        var session = await sessionService.GetAsync(sessionId);
        if (session.PaymentStatus != "paid")
        {
            return Result.Fail("Session status is not 'paid'");
        }
        
        var decimalAmount = session.AmountTotal!.Value / 100;
        
        await using var transaction = await _context.Database.BeginTransactionAsync();
        
        _context.Payments.Add(new()
        {
            Amount = decimalAmount,
            CreatedAt = DateTime.UtcNow,
            UserId = userId,
            SessionId = sessionId
        });
        
        var balanceExists = await _context.Balances.AnyAsync(x => x.UserId == userId);
        if (balanceExists)
        {
            await _context.Balances
                .Where(x => x.UserId == userId)
                .ExecuteUpdateAsync(x => x.SetProperty(
                    b => b.Amount, b => b.Amount + decimalAmount));
        }
        else
        {
            _context.Balances.Add(new()
            {
                UserId = userId,
                Amount = decimalAmount
            });
        }
        
        await _context.SaveChangesAsync();

        await transaction.CommitAsync();

        return Result.Ok();
    }
}