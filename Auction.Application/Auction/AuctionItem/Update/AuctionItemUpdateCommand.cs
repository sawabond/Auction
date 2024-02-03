using Microsoft.AspNetCore.Http;

namespace Auction.Application.Auction.AuctionItem.Update;

public class AuctionItemUpdateCommand
{
    public Guid Id { get; init; }
    
    public decimal StartingPrice { get; set; }

    public decimal MinimalBid { get; set; }
    
    public string Name { get; set; }

    public string Description { get; set; }

    public IFormFileCollection  Photos { get; set; }
}