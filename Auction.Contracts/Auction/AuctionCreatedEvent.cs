﻿using Auction.Core.Auction.Enums;
using Core;

namespace Auction.Contracts.Auction;

public class AuctionCreatedEvent : IEvent
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }
    
    public DateTime StartTime { get; set; }

    public DateTime? EndTime { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public AuctionType AuctionType { get; set; }
}