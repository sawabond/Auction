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

    public ICollection<AuctionItemPhoto> Photos { get; set; }

    public IReadOnlyCollection<Bid> Bids => _bids;

    public Bid AddBid(Guid userId, decimal amount, DateTimeOffset date)
    {
        var updatedPrice = ActualPrice + amount;
        
        ActualPrice = updatedPrice;
        
        var bid = new Bid(Id, userId, amount, date, updatedPrice);
        
        _bids.Add(bid);

        return bid;
    }
}