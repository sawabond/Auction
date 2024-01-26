namespace Auction.Core.Auction.Entities;

public class AuctionItemPhoto
{
    public AuctionItem AuctionItem { get; set; }
    public int Id { get; set; }
    
    public string Name { get; set; }
    
    public string PhotoUrl { get; set; }
}