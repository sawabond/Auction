using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Auction.Infrastructure.Auction.EntityConfigurations;

public class AuctionConfiguration : IEntityTypeConfiguration<Core.Auction.Entities.Auction>
{
    public void Configure(EntityTypeBuilder<Core.Auction.Entities.Auction> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
        builder.HasIndex(x => x.Name).IsUnique();
        
        builder.HasIndex(x => x.StartTime).IsDescending();

        builder.Property(x => x.UserId).IsRequired();

        builder.Property(x => x.Description).HasMaxLength(200);
    }
}