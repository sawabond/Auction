namespace Payment.Contracts.Clients;

public class BalanceModel
{
    public Guid UserId { get; set; }
    
    public decimal Amount { get; set; }
}