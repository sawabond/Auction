using System.Security.Claims;
using Auction.Contracts;
using Auth.Contracts;
using Core;
using Kafka.Messaging;
using Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Payment.Application.Balance;
using Payment.Application.Payment;
using Payment.Contracts;
using Payment.Infrastructure;
using Payment.Web;
using Shared;
using Stripe;
using Stripe.Checkout;
using BalanceService = Payment.Application.Balance.BalanceService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSerilogLogging(builder.Configuration);
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IBalanceService, BalanceService>();

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

builder.Services.AddJwtAuthentication(builder.Configuration);

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

builder.AddKafkaInfrastructure(
    handlersAssembly: typeof(PaymentInfrastructureAssemblyReference).Assembly,
    typeof(AuctionContractsAssemblyReference).Assembly,
    typeof(PaymentContractsAssemblyReference).Assembly,
    typeof(AuthContractsAssemblyReference).Assembly);

var app = builder.Build();

app.MapPost("/api/top-up", async (
    [FromBody] TopUpCommand topUpRequest,
    [FromQuery] string returnUrl,
    [FromQuery] string redirectUrl,
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
        SuccessUrl = $"{returnUrl}/api/success?userId={topUpRequest.UserId}&session_id={{CHECKOUT_SESSION_ID}}&redirectUrl={redirectUrl}",
        CancelUrl = $"{returnUrl}/cancel"
    };

    var sessionService = new SessionService(stripeClient);
    var session = await sessionService.CreateAsync(sessionCreateOptions);

    return Results.Ok(new { session.Url });
});

app.MapGet("/api/success", async (
    [FromQuery(Name="session_id")] string sessionId,
    [FromQuery] Guid userId,
    [FromQuery] string redirectUrl,
    [FromServices] IPaymentService paymentService) =>
{
    var result = await paymentService.CreatePaymentAsync(userId, sessionId);
    if (result.IsSuccess)
    {
        return Results.Redirect(redirectUrl);
    }

    return Results.BadRequest();
});

app.MapGet("/api/balances", async (
    ClaimsPrincipal user,
    [FromServices] IBalanceService balanceService) =>
{
    var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier));
    var balance = await balanceService.GetUserBalance(userId);
    if (balance is not null)
    {
        return Results.Ok(balance);
    }

    return Results.BadRequest();
});

app.MapGet("/api/balances/{userId}", async (
    Guid userId,
    [FromServices] IBalanceService balanceService) =>
{
    var balance = await balanceService.GetUserBalance(userId);
    if (balance is not null)
    {
        return Results.Ok(balance);
    }

    return Results.BadRequest();
});

app.Run();