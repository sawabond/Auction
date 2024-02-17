using Auction.Contracts.Auction.AuctionItem;
using KafkaFlow;

namespace Auction.Infrastructure.Auction.AuctionItem;

public class AuctionItemSoldEventHandler() : IMessageHandler<AuctionItemSoldEvent>
{
    public async Task Handle(IMessageContext context, AuctionItemSoldEvent message)
    {
        
    }
}