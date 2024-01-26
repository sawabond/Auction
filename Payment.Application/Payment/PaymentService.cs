using Core;
using FluentResults;
using Payment.Contracts.Balance;
using Stripe;
using Stripe.Checkout;

namespace Payment.Application.Payment;

public interface IPaymentService
{
    Task<Result> CreatePaymentAsync(Guid userId, string sessionId);
}

public class PaymentService(
    IRepository<Core.Payment> _paymentRepository,
    IRepository<Core.Balance> _balanceRepository,
    IPublisher _publisher,
    IStripeClient _stripeClient) : IPaymentService
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
        
        // TODO: refactor repository to use transactions
        
        await _paymentRepository.AddAsync(new()
        {
            Amount = decimalAmount,
            CreatedAt = DateTime.UtcNow,
            UserId = userId,
            SessionId = sessionId
        });
        
        var balance = await _balanceRepository.GetByIdAsync(userId);
        if (balance is not null)
        {
            balance.Amount += decimalAmount;
            await _balanceRepository.UpdateAsync(balance);
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