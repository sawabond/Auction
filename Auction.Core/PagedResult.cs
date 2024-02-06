namespace Auction.Core;

public record PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; } = 0;
    public int Page { get; set; }
    public int PageSize { get; set; }
}