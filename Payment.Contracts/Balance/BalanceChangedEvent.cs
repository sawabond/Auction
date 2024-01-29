using Core;

namespace Payment.Contracts.Balance;

public class BalanceChangedEvent : IEvent
{
    public Guid UserId { get; set; }
    public decimal Delta { get; set; }
    public decimal CurrentBalance { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}