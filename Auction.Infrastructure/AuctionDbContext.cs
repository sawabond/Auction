using System.Reflection;
using Auction.Core.Auction.Entities;
using Microsoft.EntityFrameworkCore;

namespace Auction.Infrastructure;

public class AuctionDbContext : DbContext
{
    public AuctionDbContext(DbContextOptions<AuctionDbContext> options) : base(options)
    {
        
    }

    public DbSet<Core.Auction.Entities.Auction> Auctions { get; set; }
    
    public DbSet<AuctionItem> AuctionItems { get; set; }

    public DbSet<AuctionItemPhoto> AuctionItemPhotos { get; set; }

    public DbSet<Bid> Bids { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("auction");
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        
        base.OnModelCreating(modelBuilder);
    }
}