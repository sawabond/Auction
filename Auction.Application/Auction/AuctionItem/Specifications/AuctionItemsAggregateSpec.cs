using Ardalis.Specification;
using Auction.Application.Auction.AuctionItem.Get;

namespace Auction.Application.Auction.AuctionItem.Specifications;

public class AuctionItemsAggregateSpec : Specification<Core.Auction.Entities.AuctionItem>
{
    public AuctionItemsAggregateSpec(GetAuctionItemsQuery query)
    {
        Query
            .Include(x => x.Bids)
            .Include(x => x.Photos);
        
        query.Search = query.Search?.ToLower();
        if (!string.IsNullOrWhiteSpace(query.Search))
            Query.Where(x => x.Name.ToLower().Contains(query.Search)
                             || x.Description.ToLower().Contains(query.Search)
                             || x.Id.ToString().ToLower().Contains(query.Search)
                             );
        
        if (query.AuctionId.HasValue)
            Query.Where(x => x.Auction.Id == query.AuctionId);
        
        if (query.ItemId.HasValue)
            Query.Where(x => query.ItemId == x.Id);
        
        if (query.UserId.HasValue)
            Query.Where(x => x.Bids
                .OrderByDescending(x => x.Date)
                .FirstOrDefault().UserId == query.UserId);
        
        if (query.MinPrice.HasValue)
            Query.Where(x => x.ActualPrice >= query.MinPrice);
        if (query.MaxPrice.HasValue)
            Query.Where(x => x.ActualPrice <= query.MaxPrice);
        
        Query.Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize);
    }
}