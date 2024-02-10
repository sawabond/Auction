using Auction.Application.Auction;
using Auction.Application.Auction.AuctionItem.Get;
using Auction.Application.Auction.Get;
using Auction.Web.Auction.AuctionItem.Get;
using Auction.Web.Auction.Get;
using Riok.Mapperly.Abstractions;

namespace Auction.Web.Auction;

[Mapper]
public static partial class AuctionMapper
{
    public static partial GetAuctionsQuery ToQuery(this GetAuctionsRequest model);
    public static partial GetAuctionItemsQuery ToQuery(this GetAuctionItemsRequest model);
}