namespace Payment.Core;

public class Balance
{
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public uint Version { get; set; }
}