using Auction.Application.Auction.AuctionItem.Create;
using Riok.Mapperly.Abstractions;

namespace Auction.Application.Auction.AuctionItem;

[Mapper]
public static partial class AuctionItemMapper
{
    public static partial Core.Auction.Entities.AuctionItem ToEntity(this AuctionItemCreateCommand model);
}