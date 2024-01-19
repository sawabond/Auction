﻿using Auction.Application.Auction.Create;
using Auction.Contracts.Auction;
using Auction.Contracts.Auction.AuctionItem;
using Riok.Mapperly.Abstractions;

namespace Auction.Application.Auction;

[Mapper]
public static partial class AuctionMapper
{
    public static partial Core.Auction.Entities.Auction ToEntity(this AuctionCreateCommand model);
    
    public static partial AuctionCreatedEvent ToEvent(this Core.Auction.Entities.Auction model);
    
    public static partial AuctionItemAdded ToEvent(this Core.Auction.Entities.AuctionItem model);
}