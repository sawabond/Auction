using Core;

namespace Auction.Contracts.Auction.AuctionItem;

public class AuctionItemGotBiddedEvent : IEvent
{
    public Guid AuctionId { get; set; }
    
    public Guid AuctionItemId { get; set; }
    
    public Guid UserId { get; set; }
    
    public decimal OldPrice { get; set; }

    public decimal Bid { get; set; }
    
    public decimal NewPrice { get; set; }
    
    public DateTime BiddedAt { get; set; } = DateTime.UtcNow;
}