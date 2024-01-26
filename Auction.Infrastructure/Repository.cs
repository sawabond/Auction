using Ardalis.Specification.EntityFrameworkCore;
using Core;

namespace Auction.Infrastructure;

public class Repository<T> : RepositoryBase<T>, IRepository<T> where T : class
{
    public Repository(AuctionDbContext context) : base(context)
    {
    }
}