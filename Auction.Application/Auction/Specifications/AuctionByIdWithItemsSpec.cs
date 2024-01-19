using Ardalis.Specification;

namespace Auction.Application.Auction.Specifications;

public class AuctionByIdWithItemsSpec : SingleResultSpecification<Core.Auction.Entities.Auction>
{
    public AuctionByIdWithItemsSpec(Guid id)
    {
        Query
            .Include(x => x.AuctionItems)
            .Where(x => x.Id == id);
    }
}