namespace Auction.Application.Auction.Get;

public record GetAuctionsQuery
{
    public int PageSize { get; set; }

    public string? Cursor { get; set; }

    public string? NameStartsWith { get; set; }

    public string? DescriptionContains { get; set; }

    public bool? OnlyActive { get; set; }

    public List<Guid> UserIds { get; set; } = new();
}