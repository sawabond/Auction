using Ardalis.Specification;

namespace Auction.Application.Auction.Specifications;

public class FilteredPaginatedAuctionWithItemsSpec : Specification<Core.Auction.Entities.Auction>
{
    public FilteredPaginatedAuctionWithItemsSpec(
        string? name, 
        string? descriptionSubstring,
        DateTime? cursor,
        int? take)
    {
        if (!string.IsNullOrWhiteSpace(name))
            Query.Where(x => x.Name.StartsWith(name));
        
        if (!string.IsNullOrWhiteSpace(descriptionSubstring))
            Query.Where(x => x.Description.Contains(descriptionSubstring));
        
        if (cursor.HasValue)
            Query.Where(x => x.StartTime > cursor);

        if (take.HasValue)
            Query.Take(take.Value);

        Query.Include(x => x.AuctionItems);
    }
}