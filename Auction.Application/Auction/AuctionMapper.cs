using Auction.Application.Auction.Create;
using Riok.Mapperly.Abstractions;

namespace Auction.Application.Auction;

[Mapper]
public static partial class AuctionMapper
{
    public static partial Core.Auction.Entities.Auction ToEntity(this AuctionCreateCommand model);
}