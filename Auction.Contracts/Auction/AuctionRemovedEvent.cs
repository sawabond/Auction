using Core;

namespace Auction.Contracts.Auction;

public class AuctionRemovedEvent : IEvent
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public DateTime RemovedAt { get; set; } = DateTime.UtcNow;
}