using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Auction.Infrastructure.Auction.EntityConfigurations;

public class AuctionItemConfiguration : IEntityTypeConfiguration<Core.Auction.Entities.AuctionItem>
{
    public void Configure(EntityTypeBuilder<Core.Auction.Entities.AuctionItem> builder)
    {
        builder.HasMany(x => x.Bids)
            .WithOne(x => x.AuctionItem)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasMany(x => x.Photos)
            .WithOne(x => x.AuctionItem)
            .OnDelete(DeleteBehavior.Cascade);
    }
}