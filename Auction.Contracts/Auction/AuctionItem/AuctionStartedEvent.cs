using Core;

namespace Auction.Contracts.Auction.AuctionItem;

public class AuctionStartedEvent : IEvent
{
    public Guid Id { get; set; }
    
    public DateTime StartTime { get; set; }
}