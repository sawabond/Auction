using Core;

namespace Auction.Contracts.Auction.AuctionItem;

public class AuctionItemRemovedEvent : IEvent
{
    public Guid Id { get; set; }
    
    public Guid AuctionId { get; set; }
    
    public DateTime RemovedAt { get; set; } = DateTime.UtcNow;
}