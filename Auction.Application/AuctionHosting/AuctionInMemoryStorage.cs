namespace Auction.Application.AuctionHosting;

public interface IActiveAuctionsStorage
{
    Task AddAsync(Core.Auction.Entities.Auction auction);
    Task<Core.Auction.Entities.Auction?> GetAsync(Guid auctionId);
    Task<bool> Remove(Guid auctionId);
}

public class ActiveAuctionsInMemoryStorage(
    Dictionary<Guid, Core.Auction.Entities.Auction> _auctions)
    : IActiveAuctionsStorage
{
    public Task AddAsync(Core.Auction.Entities.Auction auction)
    {
        _auctions.Add(auction.Id, auction);
        return Task.CompletedTask;
    }

    public async Task<Core.Auction.Entities.Auction?> GetAsync(Guid auctionId)
    {
        return _auctions.GetValueOrDefault(auctionId);
    }

    public async Task<bool> Remove(Guid auctionId)
    {
        return _auctions.Remove(auctionId);
    }
}