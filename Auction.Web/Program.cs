using System.Security.Claims;
using Auction.Application.Auction;
using Auction.Application.Auction.AuctionItem;
using Auction.Application.Auction.AuctionItem.Create;
using Auction.Application.Auction.Create;
using Auction.Application.Common;
using Auction.Contracts;
using Auction.Core.Common;
using Auction.Infrastructure;
using Auction.Infrastructure.Common;
using Auction.Web.Auction;
using Auction.Web.Auction.Get;
using Auction.Web.Common.Extensions;
using Hangfire;
using Hangfire.PostgreSql;
using Kafka.Messaging;
using Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;
using Shared;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuctionFeature();

builder.AddKafkaInfrastructure(
    handlersAssembly: typeof(AuctionInfrastructureAssemblyReference).Assembly,
    eventsAssemblies: typeof(AuctionContractsAssemblyReference).Assembly);

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IBlobService, AzureBlobService>();
builder.Services.AddScoped<IAuctionItemService, AuctionItemService>();

builder.Services.AddHangfire((sp, config) =>
{
    config.UsePostgreSqlStorage(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddHangfireServer();

builder.Services.AddDbContext<AuctionDbContext>(x =>
{
    x.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

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

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseSerilogRequestLogging();

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

app.MapGet("/api/auctions", async ([AsParameters] GetAuctionsRequest request, [FromServices] IAuctionService auctionService) =>
    {
        var result = await auctionService.Get(request.ToQuery());

        return result.ToResponse();
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

app.Run();