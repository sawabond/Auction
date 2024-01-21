using Core;

namespace Auction.Contracts.Auction.AuctionItem;

public class AuctionItemStartedSellingEvent : IEvent
{
    public Guid Id { get; set; }
    
    public Guid AuctionId { get; set; }

    public TimeSpan SellingPeriod { get; set; }

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
}