using Ardalis.Specification;

namespace Auction.Application.Auction.Specifications;

public class ActiveAuctionsWithItemsSpec : Specification<Core.Auction.Entities.Auction>
{
    public ActiveAuctionsWithItemsSpec()
    {
        Query
            .Include(x => x.AuctionItems)
            .ThenInclude(x => x.Bids)
            .Where(x => x.AuctionItems.Any(x => x.IsSellingNow));
    }
}