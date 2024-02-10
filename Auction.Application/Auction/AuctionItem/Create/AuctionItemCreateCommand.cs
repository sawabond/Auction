using Microsoft.AspNetCore.Http;

namespace Auction.Application.Auction.AuctionItem.Create;

public sealed class AuctionItemCreateCommand
{
    public decimal StartingPrice { get; set; }

    public decimal MinimalBid { get; set; }
    
    public string Name { get; set; }

    public string Description { get; set; }

    public IFormFileCollection  Photos { get; set; }
}