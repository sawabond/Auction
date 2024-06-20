using Ardalis.Specification;

namespace Auction.Application.Auction.Specifications;

public class AuctionByIdAggregateSpec : SingleResultSpecification<Core.Auction.Entities.Auction>
{
    public AuctionByIdAggregateSpec(Guid id)
    {
        Query
            .Include(x => x.AuctionItems)
            .ThenInclude(x => x.Photos)
            .Where(x => x.Id == id);
    }
}