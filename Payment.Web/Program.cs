using Microsoft.AspNetCore.Mvc;
using Payment.Web;
using Stripe;
using Stripe.Checkout;

var builder = WebApplication.CreateBuilder(args);

StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];
builder.Services.Configure<StripeOptions>(builder.Configuration.GetSection("Stripe"));

var appInfo = new AppInfo
{
    Name = "StripeEvents",
    Version = "0.1.0"
};

StripeConfiguration.AppInfo = appInfo;

builder.Services.AddHttpClient("Stripe");
builder.Services.AddTransient<IStripeClient, StripeClient>(s =>
{
    var clientFactory = s.GetRequiredService<IHttpClientFactory>();
    var httpClient = new SystemNetHttpClient(
        httpClient: clientFactory.CreateClient("Stripe"),
        maxNetworkRetries: StripeConfiguration.MaxNetworkRetries,
        appInfo: appInfo,
        enableTelemetry: StripeConfiguration.EnableTelemetry);

    return new StripeClient(apiKey: StripeConfiguration.ApiKey, httpClient: httpClient);
});

var app = builder.Build();

app.MapPost("/api/top-up", async (
    HttpRequest request,
    [FromServices] IStripeClient stripeClient) =>
{
    var baseUrl = $"{request.Scheme}://{request.Host}";

    var sessionCreateOptions = new SessionCreateOptions
    {
        LineItems = new()
        {
            new SessionLineItemOptions()
            {
                // Assuming topUpRequest.Amount is the amount to be topped up
                PriceData = new SessionLineItemPriceDataOptions
                {
                    UnitAmount = 2244, // Amount in smallest currency unit, e.g., cents for USD
                    Currency = "UAH",
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = "Account Top-Up"
                    }
                },
                Quantity = 1
            }
        },
        Mode = "payment",
        SuccessUrl = $"{baseUrl}/success?session_id={{CHECKOUT_SESSION_ID}}",
        CancelUrl = $"{baseUrl}/cancel"
    };

    var sessionService = new SessionService(stripeClient);
    var session = await sessionService.CreateAsync(sessionCreateOptions);

    return Results.Ok(new { session.Url });
});

app.Run();