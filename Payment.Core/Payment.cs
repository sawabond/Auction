namespace Payment.Core;

public class Payment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public string SessionId { get; set; }
    public DateTime CreatedAt { get; set; }
}