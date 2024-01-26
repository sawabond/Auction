using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Payment.Infrastructure.Balance;

public class BalanceEntityConfiguration : IEntityTypeConfiguration<Core.Balance>
{
    public void Configure(EntityTypeBuilder<Core.Balance> builder)
    {
        builder.HasKey(e => e.UserId);
        
        builder.Property(e => e.Version)
            .IsRowVersion();
    }
}