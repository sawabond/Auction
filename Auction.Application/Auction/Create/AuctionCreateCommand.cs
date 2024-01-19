using Auction.Core.Auction.Enums;

namespace Auction.Application.Auction.Create;

public sealed class AuctionCreateCommand
{
    public Guid Id { get; init; } = Guid.NewGuid();

    public string Name { get; init; }

    public string Description { get; init; }

    public DateTime StartTime { get; init; }

    public AuctionType AuctionType { get; init; }
}