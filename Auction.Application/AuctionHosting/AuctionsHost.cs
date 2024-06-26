﻿using Auction.Application.Auction.Specifications;
using Auction.Contracts.Auction.AuctionItem;
using Core;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Auction.Application.AuctionHosting;

public interface IAuctionsHost
{
    Task<Core.Auction.Entities.Auction> StartAuctionById(Guid auctionId);
}

public class AuctionsHost(
    ILogger<AuctionsHost> _logger,
    IActiveAuctionsStorage _activeAuctionsStorage,
    IServiceScopeFactory _scopeFactory) : IAuctionsHost
{
    public async Task<Core.Auction.Entities.Auction> StartAuctionById(Guid auctionId)
    { 
        using var scope = _scopeFactory.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IRepository<Core.Auction.Entities.Auction>>();
        var publisher = scope.ServiceProvider.GetRequiredService<IPublisher>();

        _logger.LogInformation("Starting auction with id {AuctionId}", auctionId);
        
        var auction = await repository.FirstOrDefaultAsync(new AuctionByIdAggregateSpec(auctionId));
        await _activeAuctionsStorage.AddAsync(auction);

        var firstItem = auction.GetFirstItem();
        _logger.LogInformation("First item to be selling is {@FirstItemToBeSelling}", firstItem);
        firstItem.IsSellingNow = true;
        
        await repository.UpdateAsync(auction);

        _logger.LogInformation("Publishing AuctionItemStartedSellingEvent {AuctionId}", auction.Id);
        await publisher.Publish(auction.Id, new AuctionItemStartedSellingEvent
        {
            Id = firstItem.Id,
            AuctionId = auction.Id,
            StartedAt = DateTime.UtcNow,
            SellingPeriod = firstItem.SellingPeriod,
        });

        return auction;
    }
}