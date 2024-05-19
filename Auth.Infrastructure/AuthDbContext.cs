using Auth.Core.User;
using Auth.Core.User.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Auth.Infrastructure;

public class AuthDbContext(DbContextOptions<AuthDbContext> _options) : IdentityDbContext<AppUser>(_options)
{
    public DbSet<AppUser> AppUsers { get; set; }
    public DbSet<IdentityRole> Roles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<IdentityRole>()
            .HasData(new IdentityRole()
            {
                Id = Core.User.Roles.User.Id,
                Name = Core.User.Roles.User.Name,
                NormalizedName = Core.User.Roles.User.Name.ToUpper()
            },
            new IdentityRole()
            {
                Id = Core.User.Roles.Seller.Id,
                Name = Core.User.Roles.Seller.Name,
                NormalizedName = Core.User.Roles.Seller.Name.ToUpper()
            });
    }
}