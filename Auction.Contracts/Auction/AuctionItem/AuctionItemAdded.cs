using Auction.Core.Auction.Entities;
using Core;

namespace Auction.Contracts.Auction.AuctionItem;

public class AuctionItemAdded : IEvent
{
    public Guid Id { get; set; }
    
    public decimal StartingPrice { get; set; }

    public decimal MinimalBid { get; set; }
    
    public string Name { get; set; }

    public string Description { get; set; }
    
    public ICollection<AuctionItemPhoto> Photos { get; set; }
}