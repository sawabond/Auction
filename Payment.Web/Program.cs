using Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Payment.Application;
using Payment.Infrastructure;
using Payment.Web;
using Stripe;
using Stripe.Checkout;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSerilogLogging(builder.Configuration);
builder.Services.AddScoped<IPaymentService, PaymentService>();

builder.Services.AddDbContext<PaymentDbContext>(x =>
{
    x.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

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
    [FromBody] TopUpRequest topUpRequest,
    [FromQuery] string returnUrl,
    [FromServices] IStripeClient stripeClient) =>
{
    var sessionCreateOptions = new SessionCreateOptions
    {
        LineItems = new()
        {
            new SessionLineItemOptions()
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    UnitAmount = topUpRequest.Amount,
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
        SuccessUrl = $"{returnUrl}/api/success?userId={topUpRequest.UserId}&session_id={{CHECKOUT_SESSION_ID}}",
        CancelUrl = $"{returnUrl}/cancel"
    };

    var sessionService = new SessionService(stripeClient);
    var session = await sessionService.CreateAsync(sessionCreateOptions);

    return Results.Ok(new { session.Url });
});

app.MapGet("/api/success", async (
    [FromQuery(Name="session_id")] string sessionId,
    [FromQuery] Guid userId,
    [FromServices] IPaymentService paymentService) =>
{
    var result = await paymentService.CreatePaymentAsync(userId, sessionId);
    if (result.IsSuccess)
    {
        return Results.Ok();
    }

    return Results.BadRequest();
});

app.Run();

public record TopUpRequest
{
    public Guid UserId { get; set; }
    public int Amount { get; set; }
}