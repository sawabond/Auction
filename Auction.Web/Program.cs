using System.Security.Claims;
using Auction.Application.Auction;
using Auction.Application.Auction.Create;
using Auction.Core.Common;
using Auction.Infrastructure;
using Auction.Web.Auction;
using Auction.Web.Auction.Get;
using Auction.Web.Common.Extensions;
using Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;
using Shared;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuctionFeature();

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

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
    .RequireAuthorization()
    .WithOpenApi();

app.Run();