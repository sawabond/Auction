using Microsoft.AspNetCore.Mvc;

namespace Auction.Web.Auction.Get;

public class GetAuctionsRequest
{
    [FromQuery(Name = "pageSize")] 
    public int PageSize { get; init; } = 10;

    [FromQuery(Name = "cursor")]
    public string? Cursor { get; init; }

    [FromQuery(Name = "name.[sw]")] 
    public string? NameStartsWith { get; set; }

    [FromQuery(Name = "description.[contains]")]
    public string? DescriptionContains { get; set; }
}