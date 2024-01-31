using Auction.Core.Auction.Entities;
using Core;

namespace Auction.Contracts.Auction.AuctionItem;

public record AuctionItemAddedEvent : IEvent
{
    public Guid Id { get; set; }
    
    public Guid AuctionId { get; set; }
    
    public decimal StartingPrice { get; set; }

    public decimal MinimalBid { get; set; }
    
    public string Name { get; set; }

    public string Description { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    public List<AuctionItemPhotoEventModel> Photos { get; set; } = new();
}

public class AuctionItemPhotoEventModel
{
    public int Id { get; set; }
    
    public string Name { get; set; }
    
    public string PhotoUrl { get; set; }
}