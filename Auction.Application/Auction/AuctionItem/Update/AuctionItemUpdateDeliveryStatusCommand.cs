using Auction.Core.Auction.Entities;

namespace Auction.Application.Auction.AuctionItem.Update;

public record AuctionItemUpdateDeliveryStatusCommand(Guid Id, DeliveryStatus Status);