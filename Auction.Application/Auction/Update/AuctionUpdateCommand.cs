using Auction.Core.Auction.Enums;

namespace Auction.Application.Auction.Update;

public class AuctionUpdateCommand
{
    public Guid Id { get; init; }

    public string Name { get; init; }

    public string Description { get; init; }

    public DateTime StartTime { get; init; }

    public AuctionType AuctionType { get; init; }
}