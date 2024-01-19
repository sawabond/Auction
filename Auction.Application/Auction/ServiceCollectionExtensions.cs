using Auction.Application.Auction.AuctionItem;
using Microsoft.Extensions.DependencyInjection;

namespace Auction.Application.Auction;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAuctionFeature(this IServiceCollection @this)
    {
        @this.AddScoped<IAuctionService, AuctionService>();
        @this.AddScoped<IAuctionItemService, AuctionItemService>();
        
        return @this;
    }
}