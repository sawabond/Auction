using Auction.Application.Auction.Specifications;
using Auction.Core.Common;
using Microsoft.Extensions.DependencyInjection;

namespace Auction.Application.AuctionHosting.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAuctionHosting(this IServiceCollection @this)
    {
        var scope = @this.BuildServiceProvider().CreateScope();
        var repo = scope
            .ServiceProvider
            .GetRequiredService<IRepository<Core.Auction.Entities.Auction>>();
        var auctions = repo
            .ListAsync(new ActiveAuctionsWithItemsSpec()).GetAwaiter().GetResult()
            .ToDictionary(x => x.Id);
    
        @this.AddSingleton<IActiveAuctionsStorage>(_ => new ActiveAuctionsInMemoryStorage(auctions));
        
        @this.AddSingleton<IAuctionsHost, AuctionsHost>();
        scope.Dispose();
        
        return @this;
    }
}