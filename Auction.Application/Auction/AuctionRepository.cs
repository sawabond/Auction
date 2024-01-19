using Ardalis.Specification;
using Auction.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Auction.Application.Auction;

public interface IAuctionRepository
{
    Task<Guid> Create(Core.Auction.Entities.Auction auction);
}

public class AuctionRepository(AuctionDbContext _context) : IAuctionRepository
{
    public async Task<Guid> Create(Core.Auction.Entities.Auction auction)
    {
        await _context.Auctions.AddAsync(auction);
        await _context.SaveChangesAsync();
        
        return auction.Id;
    }
}