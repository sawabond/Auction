using System.Security.Claims;
using System.Text.Json.Serialization;
using Auction.Application.Auction;
using Auction.Application.Auction.AuctionItem;
using Auction.Application.Auction.AuctionItem.Create;
using Auction.Application.Auction.Create;
using Auction.Application.Auction.Get;
using Auction.Application.AuctionHosting.Extensions;
using Auction.Application.Common;
using Auction.Contracts;
using Auction.Infrastructure;
using Auction.Infrastructure.Auction.Hubs;
using Auction.Infrastructure.Common;
using Auction.Web.Auction;
using Auction.Web.Auction.Get;
using Auction.Web.Common.Extensions;
using Core;
using Jobs.Extensions;
using Kafka.Messaging;
using Logging;
using Logging.Middlewares;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Payment.Contracts.Clients;
using Shared;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<JsonOptions>(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve; // Changed from IgnoreCycles to Preserve
});

builder.Services.AddCors(x =>
{
    x.AddPolicy("DefaultPolicy", options =>
    {
        options.SetIsOriginAllowed(_ => true)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddPaymentClients(builder.Configuration);

builder.Services.AddAuctionFeature();
builder.Services.AddScheduler(builder.Configuration);
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IBlobService, AwsS3BucketService>();

builder.Services.AddDbContext<AuctionDbContext>(x =>
{
    x.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddAuctionHosting();

builder.Services.AddSerilogLogging(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(x =>
{
    x.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });
    
    x.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddSignalR();

builder.AddKafkaInfrastructure(
    handlersAssembly: typeof(AuctionInfrastructureAssemblyReference).Assembly,
    eventsAssemblies: typeof(AuctionContractsAssemblyReference).Assembly);

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DefaultPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.UseLoggingMiddleware();
//app.UseSerilogRequestLogging();

app.UseHttpsRedirection();

app.MapHub<AuctionHub>("/auction-hub").RequireCors("DefaultPolicy");

app.MapPost("/api/auctions", async (
        AuctionCreateCommand request,
        ClaimsPrincipal user,
        IAuctionService auctionService) =>
    {
        var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier));
        var result = await auctionService.Create(request, userId);

        return result.ToResponse();
    })
    .RequireAuthorization()
    .WithOpenApi();

app.MapGet("/api/user/auctions", async (
        [AsParameters] GetAuctionsRequest request,
        ClaimsPrincipal user,
        IAuctionService auctionService) =>
    {
        var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier));
        var result = await auctionService.Get(request.ToQuery() with
        {
            UserIds = new List<Guid>{ userId }
        });

        var resultVm = result.Value.Auctions.Select(x => x.ToViewModel()).ToList();

        return Results.Ok(new { result.Value.Cursor, Auctions = resultVm });
    })
    .RequireAuthorization()
    .WithOpenApi();

app.MapGet("/api/auctions", async ([AsParameters] GetAuctionsRequest request, [FromServices] IAuctionService auctionService) =>
    {
        var result = await auctionService.Get(request.ToQuery());
        if (result.IsFailed)
        {
            return Results.BadRequest();
        }
        
        var resultVm = result.Value.Auctions.Select(x => x.ToViewModel()).ToList();

        return Results.Ok(new { result.Value.Cursor, Auctions = resultVm });
    })
    .WithOpenApi();

app.MapPost("/api/auctions/{auctionId:guid}/items", async (
        Guid auctionId,
        ClaimsPrincipal user,
        [FromForm] AuctionItemCreateCommand request,
        [FromServices] IAuctionItemService auctionItemService) =>
    {
        var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier));
        var result = await auctionItemService.AddItem(auctionId, request, userId);

        return result.ToResponse();
    })
    .RequireAuthorization()
    .DisableAntiforgery()
    .WithOpenApi();

app.MapDelete("/api/auctions/{auctionId:guid}", async (
        Guid auctionId,
        ClaimsPrincipal user,
        [FromServices] IAuctionService auctionService) =>
    {
        var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier));
        var result = await auctionService.Delete(userId, auctionId);
        if (result.IsFailed)
        {
            return Results.BadRequest(string.Join(Environment.NewLine, result.Errors.Select(x => x.Message)));
        }

        return Results.NoContent();
    })
    .RequireAuthorization()
    .DisableAntiforgery()
    .WithOpenApi();

app.Run();