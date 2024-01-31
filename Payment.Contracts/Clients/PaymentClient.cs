using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Payment.Contracts.Clients;

public interface IPaymentClient
{
    Task<BalanceModel> GetBalanceAsync(Guid userId, CancellationToken cancellationToken = default);
}

public class PaymentClient(IHttpClientFactory _httpClientFactory, ILogger<PaymentClient> _logger) : IPaymentClient
{
    public async Task<BalanceModel> GetBalanceAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var client = _httpClientFactory.CreateClient("Payment");
        _logger.LogInformation("Sending request to Payment API to get balance for user {UserId} to {Address}", 
            userId, client.BaseAddress);
        
        var response = await client.GetAsync($"api/balances/{userId}", cancellationToken);
        response.EnsureSuccessStatusCode();
        
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return JsonConvert.DeserializeObject<BalanceModel>(content);
    }
}