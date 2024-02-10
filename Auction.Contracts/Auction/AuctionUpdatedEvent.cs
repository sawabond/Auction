using Auction.Core.Auction.Enums;
using Core;

namespace Auction.Contracts.Auction;

public class AuctionUpdatedEvent : IEvent
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }
    
    public DateTime StartTime { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public AuctionType AuctionType { get; set; }
}