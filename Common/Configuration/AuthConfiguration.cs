namespace Shared.Configuration;

public record AuthConfiguration
{
    public const string Section = "Auth";
    
    public string Issuer { get; init; }
    
    public string SecurityKey { get; init; }

    public TimeSpan ExpirationPeriod { get; set; } = TimeSpan.FromDays(7);
}