using Auction.Core.Auction.Enums;

namespace Auction.Core.Auction.Entities;

public class Auction
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }
    
    public DateTime StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public AuctionType AuctionType { get; set; }

    public ICollection<AuctionItem> AuctionItems { get; set; }

    public AuctionItem? GetFirstItem() => AuctionItems?.MinBy(x => x.Name);
}