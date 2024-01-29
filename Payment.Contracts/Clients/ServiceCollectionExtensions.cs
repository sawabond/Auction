using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Payment.Contracts.Clients;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddPaymentClients(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<PaymentClientConfiguration>(configuration.GetSection(PaymentClientConfiguration.Section));
        
        services.AddHttpClient("Payment", (sp, client) =>
        {
            var settings = sp.GetRequiredService<IOptions<PaymentClientConfiguration>>().Value;

            client.BaseAddress = new Uri(settings.BaseAddress);
        });
        
        services.AddScoped<IPaymentClient, PaymentClient>();
        
        return services;
    }
}