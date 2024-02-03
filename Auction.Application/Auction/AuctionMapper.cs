using Auction.Application.Auction.AuctionItem.Update;
using Auction.Application.Auction.Create;
using Auction.Application.Auction.Update;
using Auction.Contracts.Auction;
using Auction.Contracts.Auction.AuctionItem;
using Riok.Mapperly.Abstractions;

namespace Auction.Application.Auction;

[Mapper]
public static partial class AuctionMapper
{
    public static partial Core.Auction.Entities.Auction ToEntity(this AuctionCreateCommand model);
    public static partial void UpdateEntity(this AuctionUpdateCommand model, Core.Auction.Entities.Auction entity);
    public static partial AuctionCreatedEvent ToAuctionCreatedEvent(this Core.Auction.Entities.Auction model);
    public static partial AuctionCreatedEvent ToAuctionUpdatedEvent(this Core.Auction.Entities.Auction model);
    public static partial AuctionItemAddedEvent ToItemAddedEvent(this Core.Auction.Entities.AuctionItem model);
    public static partial AuctionItemUpdatedEvent ToItemUpdatedEvent(this Core.Auction.Entities.AuctionItem model);
    public static partial void UpdateEntity(this AuctionItemUpdateCommand model, Core.Auction.Entities.AuctionItem entity);
    public static partial AuctionViewModel ToViewModel(this Core.Auction.Entities.Auction model);
    public static partial BidViewModel ToViewModel(this Core.Auction.Entities.Bid model);
}