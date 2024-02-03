using Auction.Application.Auction.AuctionItem.Create;
using Auction.Application.Auction.AuctionItem.Update;
using Auction.Application.Auction.Specifications;
using Auction.Application.Common;
using Auction.Contracts.Auction.AuctionItem;
using Auction.Core.Auction.Entities;
using Core;
using FluentResults;
using Microsoft.AspNetCore.Http;

namespace Auction.Application.Auction.AuctionItem;

public interface IAuctionItemService
{
    Task<Result<Guid>> AddItem(Guid auctionId, AuctionItemCreateCommand command, Guid ownerId);
    Task<Result> UpdateItem(Guid auctionId, AuctionItemUpdateCommand command, Guid ownerId);
    Task<Result> DeleteItem(Guid auctionId, Guid itemId, Guid ownerId);
}

public class AuctionItemService(
    IRepository<Core.Auction.Entities.Auction> _repository,
    IBlobService _blobService,
    IPublisher _publisher) : IAuctionItemService
{
    public async Task<Result<Guid>> AddItem(Guid auctionId, AuctionItemCreateCommand command, Guid ownerId)
    {
        var auction = await _repository.SingleOrDefaultAsync(new AuctionByIdAggregateSpec(auctionId));
        if (auction is null)
        {
            return Result.Fail($"There is no auction with id {auctionId}");
        }
        if (auction.UserId != ownerId)
        {
            return Result.Fail($"User with id {ownerId} is not owner of this auction");
        }
        if (auction.EndTime is not null)
        {
            return Result.Fail($"Auction with id {auctionId} is already finished");
        }

        var auctionItem = command.ToEntity();
        
        await FillItemPhotos(command.Photos, auctionId, auctionItem);

        auction.AuctionItems.Add(auctionItem);
        await _repository.SaveChangesAsync();
        await _publisher.Publish(auctionItem.Id, auctionItem.ToItemAddedEvent() with
        {
            AuctionId = auctionId
        });

        return Result.Ok(auctionItem.Id);
    }

    public async Task<Result> UpdateItem(Guid auctionId, AuctionItemUpdateCommand command, Guid ownerId)
    {
        var auction = await _repository.SingleOrDefaultAsync(new AuctionByIdAggregateSpec(auctionId));
        if (auction is null)
            return Result.Fail($"There is no auction with id {auctionId}");
        
        if (auction.UserId != ownerId)
            return Result.Fail($"User with id {ownerId} is not owner of this auction");
        
        if (auction.EndTime is not null)
            return Result.Fail($"Auction with id {auctionId} is already finished");

        var itemToUpdate = auction.AuctionItems.Find(x => x.Id == command.Id);
        if (itemToUpdate is null)
            return Result.Fail($"Auction item with id {command.Id} does not exist in this auction");
        
        if (auction.AuctionItems.Any(x => x.IsSellingNow))
            return Result.Fail($"Auction with id {auctionId} has already started");
        
        command.UpdateEntity(itemToUpdate);
        
        // TODO: Make old photo deletion
        await FillItemPhotos(command.Photos, auctionId, itemToUpdate);
        
        await _repository.UpdateAsync(auction);
        await _repository.SaveChangesAsync();
        await _publisher.Publish(command.Id, itemToUpdate.ToItemUpdatedEvent() with
        {
            AuctionId = auctionId
        });

        return Result.Ok();
    }
    
    public async Task<Result> DeleteItem(Guid auctionId, Guid itemId, Guid ownerId)
    {
        var auction = await _repository.SingleOrDefaultAsync(new AuctionByIdAggregateSpec(auctionId));
        if (auction is null)
        {
            return Result.Fail($"There is no auction with id {auctionId}");
        }
        if (auction.UserId != ownerId)
        {
            return Result.Fail($"User with id {ownerId} is not owner of this auction");
        }
        if (auction.EndTime is not null)
        {
            return Result.Fail($"Auction with id {auctionId} is already finished");
        }

        var itemToDelete = auction.AuctionItems.Find(x => x.Id == itemId);
        if (itemToDelete is null)
        {
            return Result.Fail($"Auction item with id {itemId} does not exist in this auction");
        }
        
        // TODO: Make old photo deletion

        auction.AuctionItems.Remove(itemToDelete);
        await _repository.UpdateAsync(auction);
        await _repository.SaveChangesAsync();
        
        await _publisher.Publish(itemToDelete.Id, new AuctionItemRemovedEvent
        {
            AuctionId = auctionId,
            Id = itemId,
            RemovedAt = DateTime.UtcNow
        });

        return Result.Ok();
    }
    
    private async Task FillItemPhotos(IEnumerable<IFormFile> photoFiles,
        Guid auctionId,
        Core.Auction.Entities.AuctionItem auctionItem)
    {
        var fileTasks = photoFiles
            .Select(x => _blobService.UploadFile(x, $"{auctionId}/{Guid.NewGuid()}" + Path.GetExtension(x.FileName)));
        
        var photos = (await Task.WhenAll(fileTasks)).Select(x => new AuctionItemPhoto
        {
            Name = x.FileName,
            PhotoUrl = x.Url.ToString()
        }).ToList();

        auctionItem.Photos = photos;
    }
}