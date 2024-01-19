using Auction.Core.Auction.Enums;
using Auction.Core.Common;

namespace Auction.Contracts.Auction;

public class AuctionCreatedEvent : IEvent
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }
    
    public DateTime StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public AuctionType AuctionType { get; set; }
}