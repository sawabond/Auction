namespace Payment.Application.Payment;

public record TopUpCommand
{
    public Guid UserId { get; set; }
    public int Amount { get; set; }
}