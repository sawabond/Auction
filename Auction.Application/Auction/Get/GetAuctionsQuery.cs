namespace Auction.Application.Auction.Get;

public class GetAuctionsQuery
{
    public int PageSize { get; set; }

    public string? Cursor { get; set; }

    public string? NameStartsWith { get; set; }

    public string? DescriptionContains { get; set; }
}