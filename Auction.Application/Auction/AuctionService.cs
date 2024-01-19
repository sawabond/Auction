using Auction.Application.Auction.Create;
using Auction.Application.Auction.Get;
using Auction.Application.Auction.Helpers;
using Auction.Application.Auction.Specifications;
using Auction.Core.Common;
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
    IRepository<Core.Auction.Entities.Auction> _repository) : IAuctionService
{
    public async Task<Result<FilteredPaginatedAuctions>> Get(GetAuctionsQuery query)
    {
        var spec = new FilteredPaginatedAuctionSpec(
            query.NameStartsWith, 
            query.DescriptionContains,
            query.Cursor.ToDateTimeCursor(),
            query.PageSize + 1);
        
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
        
        var result = await _repository.AddAsync(auction);

        _logger.LogInformation("Auction with Id {AuctionId} created", auction.Id);

        return Result.Ok(result.Id);
    }
}