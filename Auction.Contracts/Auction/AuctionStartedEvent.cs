using Core;

namespace Auction.Contracts.Auction;

public class AuctionStartedEvent : IEvent
{
    public Guid Id { get; set; }
    
    public DateTime StartTime { get; set; }
}