using Core;

namespace Auction.Contracts.Auction.AuctionItem;

public class AuctionItemSoldEvent : IEvent
{
    public Guid Id { get; set; }
    
    public Guid AuctionId { get; set; }
    
    public Guid? UserId { get; set; }
    
    public decimal LastPrice { get; set; }
    
    public DateTime SoldAt { get; set; } = DateTime.UtcNow;
}