using Newtonsoft.Json;

namespace Payment.Contracts.Clients;

public interface IPaymentClient
{
    Task<BalanceModel> GetBalanceAsync(Guid userId, CancellationToken cancellationToken = default);
}

public class PaymentClient(IHttpClientFactory _httpClientFactory) : IPaymentClient
{
    public async Task<BalanceModel> GetBalanceAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var client = _httpClientFactory.CreateClient("Payment");
        
        var response = await client.GetAsync($"api/balances/{userId}", cancellationToken);
        response.EnsureSuccessStatusCode();
        
        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        return JsonConvert.DeserializeObject<BalanceModel>(content);
    }
}