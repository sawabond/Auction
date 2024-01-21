using Ardalis.Specification;
using Auction.Application.Auction.Get;
using Auction.Application.Auction.Helpers;

namespace Auction.Application.Auction.Specifications;

public class FilteredPaginatedAuctionAggregateSpec : Specification<Core.Auction.Entities.Auction>
{
    public FilteredPaginatedAuctionAggregateSpec(GetAuctionsQuery query)
    {
        if (!string.IsNullOrWhiteSpace(query.NameStartsWith))
            Query.Where(x => x.Name.StartsWith(query.NameStartsWith));
        
        if (!string.IsNullOrWhiteSpace(query.DescriptionContains))
            Query.Where(x => x.Description.Contains(query.DescriptionContains));

        var cursor = query.Cursor.ToDateTimeCursor();
        if (cursor.HasValue)
            Query.Where(x => x.StartTime > cursor);

        Query.Take(query.PageSize + 1);

        Query.Where(x => x.AuctionItems.Any(x => x.IsSellingNow));

        Query.Include(x => x.AuctionItems)
            .ThenInclude(x => x.Photos);
        
        Query.Include(x => x.AuctionItems)
            .ThenInclude(x => x.Bids);
    }
}