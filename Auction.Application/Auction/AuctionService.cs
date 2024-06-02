using Auction.Application.Auction.Create;
using Auction.Application.Auction.Get;
using Auction.Application.Auction.Helpers;
using Auction.Application.Auction.Specifications;
using Auction.Application.Auction.Update;
using Auction.Contracts.Auction;
using Core;
using FluentResults;
using Microsoft.Extensions.Logging;

namespace Auction.Application.Auction;

public interface IAuctionService
{
    Task<Result<FilteredPaginatedAuctions>> Get(GetAuctionsQuery query);
    Task<Result<Guid>> Create(AuctionCreateCommand command, Guid userId);
    Task<Result<Core.Auction.Entities.Auction>> GetById(Guid auctionId);
    Task<Result> Delete(Guid userId, Guid id);
    Task<Result> Update(AuctionUpdateCommand command, Guid userId);
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
                        PhotoUrl = "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    },
                    new()
                    {
                        Id = 0,
                        Name = "Test photo2",
                        PhotoUrl = "https://images.pexels.com/photos/3979134/pexels-photo-3979134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
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
                SellingPeriod = TimeSpan.FromSeconds(60),
                Photos = new List<Core.Auction.Entities.AuctionItemPhoto>
                {
                    new()
                    {
                        Id = 0,
                        Name = "Test photo",
                        PhotoUrl = "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    },
                    new()
                    {
                        Id = 0,
                        Name = "Test photo2",
                        PhotoUrl = "https://images.pexels.com/photos/3979134/pexels-photo-3979134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    }
                }
                });
        auction.AuctionItems.Add(
            new Core.Auction.Entities.AuctionItem
            {
                Id = Guid.NewGuid(),
                ActualPrice = 100m,
                Description = "Versace T-Shirt", 
                IsSellingNow = false,
                MinimalBid = 30m,
                Name = "Versace T-Shirt",
                StartingPrice = 100m,
                SellingPeriod = TimeSpan.FromSeconds(60),
                Photos = new List<Core.Auction.Entities.AuctionItemPhoto>
                {
                    new()
                    {
                        Id = 0,
                        Name = "Test photo",
                        PhotoUrl = "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    },
                    new()
                    {
                        Id = 0,
                        Name = "Test photo2",
                        PhotoUrl = "https://images.pexels.com/photos/3979134/pexels-photo-3979134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    }
                    
                }
            });
        auction.AuctionItems.Add(
            new Core.Auction.Entities.AuctionItem
            {
                Id = Guid.NewGuid(),
                ActualPrice = 100m,
                Description = "Armani T-Shirt", 
                IsSellingNow = false,
                MinimalBid = 30m,
                Name = "Armani T-Shirt",
                StartingPrice = 100m,
                SellingPeriod = TimeSpan.FromSeconds(60),
                Photos = new List<Core.Auction.Entities.AuctionItemPhoto>
                {
                    new()
                    {
                        Id = 0,
                        Name = "Test photo",
                        PhotoUrl = "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    },
                    new()
                    {
                        Id = 0,
                        Name = "Test photo2",
                        PhotoUrl = "https://images.pexels.com/photos/3979134/pexels-photo-3979134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    }
                }
            });
        auction.StartTime = DateTime.UtcNow.AddSeconds(10);
        
        var result = await _repository.AddAsync(auction);
        await _publisher.Publish(auction.Id, auction.ToAuctionCreatedEvent());
        
        _logger.LogInformation("Auction with Id {AuctionId} created", auction.Id);

        return Result.Ok(result.Id);
    }

    public async Task<Result<Core.Auction.Entities.Auction>> GetById(Guid auctionId)
    {
        _logger.LogInformation("Started getting auction with Id {AuctionId}",
            auctionId);

        var auction = await _repository.FirstOrDefaultAsync(new AuctionByIdAggregateSpec(auctionId));
        if (auction is null)
        {
            return Result.Fail("Auction not found");
        }

        return Result.Ok(auction);
    }

    public async Task<Result> Update(AuctionUpdateCommand command, Guid userId)
    {
        _logger.LogInformation("Started updating auction with Id {AuctionId} for user {UserId}",
            command.Id, userId);

        var auction = await _repository.GetByIdAsync(command.Id);
        if (auction is null)
        {
            return Result.Fail("Auction not found");
        }

        command.UpdateEntity(auction);
        
        await _repository.UpdateAsync(auction);
        await _publisher.Publish(auction.Id, auction.ToAuctionCreatedEvent());
        
        _logger.LogInformation("Auction with Id {AuctionId} updated", auction.Id);

        return Result.Ok();
    }

    public async Task<Result> Delete(Guid userId, Guid id)
    {
        var auction = await _repository.GetByIdAsync(id);
        if (auction is null)
        {
            return Result.Fail("Auction not found");
        }
        if (auction.UserId != userId)
        {
            return Result.Fail("You are not the owner of this auction");
        }
        if (auction.StartTime < DateTime.UtcNow)
        {
            return Result.Fail("Auction already started");
        }

        await _repository.DeleteAsync(auction);
        await _publisher.Publish(auction.Id, new AuctionRemovedEvent
        {
            Id = auction.Id,
            UserId = auction.UserId,
            RemovedAt = DateTime.UtcNow
        });

        return Result.Ok();
    }
}