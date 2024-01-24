using Auction.Application.Auction.AuctionItem;
using Auction.Application.Auction.AuctionItem.Bid;
using Microsoft.Extensions.DependencyInjection;

namespace Auction.Application.Auction;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAuctionFeature(this IServiceCollection @this)
    {
        @this.AddScoped<IAuctionService, AuctionService>();
        @this.AddScoped<IAuctionItemService, AuctionItemService>();
        @this.AddScoped<IBidService, BidService>();
        
        return @this;
    }
}