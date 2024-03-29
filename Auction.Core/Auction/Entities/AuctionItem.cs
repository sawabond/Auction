namespace Auction.Core.Auction.Entities;

public class AuctionItem
{
    private readonly List<Bid> _bids = new();
    
    public Guid Id { get; set; }
    
    public decimal StartingPrice { get; set; }

    public decimal ActualPrice { get; set; }

    public decimal MinimalBid { get; set; }
    
    public string Name { get; set; }

    public string Description { get; set; }

    public bool IsSellingNow { get; set; }

    public bool IsSold { get; set; }
    
    public TimeSpan SellingPeriod { get; set; } = TimeSpan.FromSeconds(30);

    public ICollection<AuctionItemPhoto> Photos { get; set; } = new List<AuctionItemPhoto>();

    public IReadOnlyCollection<Bid> Bids => _bids;
    
    public Auction Auction { get; set; }

    public Bid AddBid(Guid userId, decimal amount, DateTime date)
    {
        ActualPrice = amount;
        
        var bid = new Bid(Id, userId, amount, date, amount);
        
        _bids.Add(bid);

        return bid;
    }
}