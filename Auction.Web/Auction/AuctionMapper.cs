using Auction.Application.Auction;
using Auction.Application.Auction.Get;
using Auction.Web.Auction.Get;
using Riok.Mapperly.Abstractions;

namespace Auction.Web.Auction;

[Mapper]
public static partial class AuctionMapper
{
    public static partial GetAuctionsQuery ToQuery(this GetAuctionsRequest model);
}