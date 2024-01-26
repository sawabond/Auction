using Auction.Application.Auction.Create;
using Auction.Application.Auction.Get;
using Auction.Application.Auction.Helpers;
using Auction.Application.Auction.Specifications;
using Core;
using FluentResults;
using Microsoft.Extensions.Logging;

namespace Auction.Application.Auction;

public interface IAuctionService
{
    Task<Result<FilteredPaginatedAuctions>> Get(GetAuctionsQuery query);
    Task<Result<Guid>> Create(AuctionCreateCommand command, Guid userId);
}

public class AuctionService(
    ILogger<AuctionService> _logger, 
    IRepository<Core.Auction.Entities.Auction> _repository, 
    IPublisher _publisher) : IAuctionService
{
    public async Task<Result<FilteredPaginatedAuctions>> Get(GetAuctionsQuery query)
    {
        var spec = new FilteredPaginatedAuctionAggregateSpec(query);
        
        var auctions = await _repository.ListAsync(spec);
        
        var nextCursor = CreateNextCursor(auctions, query.PageSize);

        var result = new FilteredPaginatedAuctions
        {
            Auctions = auctions.Take(query.PageSize),
            Cursor = nextCursor,
        };

        return Result.Ok(result);
    }
    
    private string? CreateNextCursor(IList<Core.Auction.Entities.Auction> auctions, int pageSize)
    {
        string nextCursor = null;
        if (auctions.Count == pageSize + 1)
        {
            nextCursor = auctions[^2].StartTime.ToCursor();
        }

        return nextCursor;
    }
    
    public async Task<Result<Guid>> Create(AuctionCreateCommand command, Guid userId)
    {
        _logger.LogInformation("Started creating auction with Id {AuctionId} for user {UserId}",
            command.Id, userId);

        var auction = command.ToEntity();
        auction.UserId = userId;
        
        // TODO: REMOVE
        auction.AuctionItems.Add(
            new Core.Auction.Entities.AuctionItem
            {
                Id = Guid.NewGuid(),
                ActualPrice = 100m,
                Description = "Gucci Jeans", 
                IsSellingNow = false,
                MinimalBid = 20m,
                Name = "Gucci Jeans",
                StartingPrice = 100,
                SellingPeriod = TimeSpan.FromSeconds(60),
                Photos = new List<Core.Auction.Entities.AuctionItemPhoto>
                {
                    new()
                    {
                        Id = 0,
                        Name = "Test photo",
                        PhotoUrl = "https://picsum.photos/200/300"
                    }
                }
            });
        auction.AuctionItems.Add(
            new Core.Auction.Entities.AuctionItem
            {
                Id = Guid.NewGuid(),
                ActualPrice = 100m,
                Description = "Luis Vuitton T-Shirt", 
                IsSellingNow = false,
                MinimalBid = 30m,
                Name = "Luis Vuitton T-Shirt",
                StartingPrice = 100m,
                SellingPeriod = TimeSpan.FromSeconds(30),
                Photos = new List<Core.Auction.Entities.AuctionItemPhoto>
                {
                    new()
                    {
                        Id = 0,
                        Name = "Test photo",
                        PhotoUrl = "https://picsum.photos/200/300"
                    }
                }
                });
        auction.StartTime = DateTime.UtcNow.AddSeconds(10);
        
        var result = await _repository.AddAsync(auction);
        await _publisher.Publish(auction.Id, auction.ToAuctionCreatedEvent());
        
        _logger.LogInformation("Auction with Id {AuctionId} created", auction.Id);

        return Result.Ok(result.Id);
    }
}