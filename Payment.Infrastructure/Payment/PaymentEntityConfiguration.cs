using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Payment.Infrastructure.Payment;

public class PaymentEntityConfiguration : IEntityTypeConfiguration<Core.Payment>
{
    public void Configure(EntityTypeBuilder<Core.Payment> builder)
    {
        builder.HasIndex(x => x.CreatedAt);
    }
}