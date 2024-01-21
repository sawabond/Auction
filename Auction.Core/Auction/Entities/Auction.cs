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

    public List<AuctionItem> AuctionItems { get; set; } = new();

    public AuctionItem? GetFirstItem() => AuctionItems[0];
    public AuctionItem? CurrentlySellingItem => AuctionItems.FirstOrDefault(x => x.IsSellingNow);
    
    public bool SetNextItem()
    {
        var currentItem = CurrentlySellingItem;
        if (currentItem is null)
        {
            return false;
        }

        var itemWasSet = false;
        var currentItemIndex = AuctionItems.IndexOf(currentItem);
        
        CurrentlySellingItem.IsSold = true;
        if (currentItemIndex < AuctionItems.Count - 1)
        {
            itemWasSet = true;
            currentItem.IsSellingNow = false;
            AuctionItems[currentItemIndex + 1].IsSellingNow = true;
            
            return itemWasSet;
        }
        else if (currentItemIndex == AuctionItems.Count - 1)
        {
            itemWasSet = true;
            currentItem.IsSellingNow = false;
            
            return itemWasSet;
        }
        
        return itemWasSet;
    }
}