namespace Auction.Core.Auction.Entities;

public class Bid
{
    internal Bid(Guid auctionItemId, Guid userId, decimal amount, DateTime date, decimal actualPrice)
    {
        AuctionItemId = auctionItemId;
        UserId = userId;
        Amount = amount;
        Date = date;
        ActualPrice = actualPrice;
    }

    public AuctionItem AuctionItem { get; set; }

    public static Bid NullBid => new(Guid.Empty, Guid.Empty, 0, DateTime.MinValue, 0);

    public int Id { get; private set; }

    public Guid AuctionItemId { get; private set; }
    
    public Guid UserId { get; private set; }

    public decimal Amount { get; private set; }

    public DateTime Date { get; private set; }

    public decimal ActualPrice { get; private set; }
}