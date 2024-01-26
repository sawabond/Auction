namespace Payment.Contracts.Clients;

public class PaymentClientConfiguration
{
    public const string Section = "PaymentClient";
    
    public string BaseAddress { get; set; }
}