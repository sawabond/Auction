using Microsoft.AspNetCore.Mvc;

namespace Auction.Web.Auction.AuctionItem.Get;

public record GetAuctionItemsRequest
{
    public Guid? AuctionId { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; } = 10;
    
    public decimal? MinPrice { get; init; }
    public decimal? MaxPrice { get; init; }
    public string? Search { get; init; }
    public Guid? ItemId { get; init; }
}