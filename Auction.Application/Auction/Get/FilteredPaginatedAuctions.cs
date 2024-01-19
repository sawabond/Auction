namespace Auction.Application.Auction.Get;

public class FilteredPaginatedAuctions
{
    public string? Cursor { get; set; }

    public IEnumerable<Core.Auction.Entities.Auction> Auctions { get; set; }
}