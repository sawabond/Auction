using Ardalis.Specification;
using Auction.Application.Auction.AuctionItem.Get;

namespace Auction.Application.Auction.AuctionItem.Specifications;

public class AuctionItemByIdAggregateSpec : Specification<Core.Auction.Entities.AuctionItem>
{
    public AuctionItemByIdAggregateSpec(Guid id)
    {
        Query
            .Include(x => x.Photos)
            .Where(x => x.Id == id);
    }
}