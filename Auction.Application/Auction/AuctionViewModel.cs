using Auction.Core.Auction.Entities;
using Auction.Core.Auction.Enums;

namespace Auction.Application.Auction;

public class AuctionViewModel
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }
    
    public DateTime StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public AuctionType AuctionType { get; set; }

    public List<AuctionItemViewModel> AuctionItems { get; set; } = new();

    public AuctionItemViewModel? GetFirstItem() => AuctionItems.Any() ? AuctionItems[0] : null;
    public AuctionItemViewModel? CurrentlySellingItem => AuctionItems.FirstOrDefault(x => x.IsSellingNow);
}

public class AuctionItemViewModel
{
    public Guid Id { get; set; }
    
    public decimal StartingPrice { get; set; }

    public decimal ActualPrice { get; set; }

    public decimal MinimalBid { get; set; }
    
    public string Name { get; set; }

    public string Description { get; set; }

    public bool IsSellingNow { get; set; }

    public bool IsSold { get; set; }

    public DeliveryStatus DeliveryStatus { get; set; }

    public TimeSpan SellingPeriod { get; set; } = TimeSpan.FromSeconds(30);

    public List<AuctionItemPhotoViewModel> Photos { get; set; } = new();

    public List<BidViewModel> Bids { get; set; } = new();
}

public class AuctionItemPhotoViewModel
{
    public int Id { get; set; }
    
    public string Name { get; set; }

    public string PhotoUrl { get; set; }
}

public class BidViewModel
{
    public Guid AuctionItemId { get; set; }
    
    public Guid UserId { get; set; }

    public decimal Amount { get; set; }

    public DateTime Date { get; set; }

    public decimal ActualPrice { get; set; }
}