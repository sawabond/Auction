using Auction.Application.Auction.Create;
using Auction.Contracts.Auction;
using Auction.Contracts.Auction.AuctionItem;
using Riok.Mapperly.Abstractions;

namespace Auction.Application.Auction;

[Mapper]
public static partial class AuctionMapper
{
    public static partial Core.Auction.Entities.Auction ToEntity(this AuctionCreateCommand model);
    
    public static partial AuctionCreatedEvent ToAuctionCreatedEvent(this Core.Auction.Entities.Auction model);
    
    public static partial AuctionItemAddedEvent ToItemAddedEvent(this Core.Auction.Entities.AuctionItem model);
    public static partial AuctionViewModel ToViewModel(this Core.Auction.Entities.Auction model);
    public static partial BidViewModel ToViewModel(this Core.Auction.Entities.Bid model);
}