using Core;

namespace Auction.Contracts.Auction;

public class AuctionClosedEvent : IEvent
{
    public Guid Id { get; set; }
    
    public DateTime ClosedAt { get; set; }
}