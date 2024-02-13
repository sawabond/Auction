namespace Auction.Application.Auction.AuctionItem.Get;

public record GetAuctionItemsQuery
{
    public Guid? AuctionId { get; init; }
    public Guid? UserId { get; set; }
    public Guid? ItemId { get; init; }
    public int Page { get; set; }
    public int PageSize { get; set; } = 10;
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Search { get; set; }
}