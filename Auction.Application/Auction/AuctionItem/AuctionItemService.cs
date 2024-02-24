using Ardalis.Specification;
using Auction.Application.Auction.AuctionItem.Create;
using Auction.Application.Auction.AuctionItem.Get;
using Auction.Application.Auction.AuctionItem.Specifications;
using Auction.Application.Auction.AuctionItem.Update;
using Auction.Application.Auction.Specifications;
using Auction.Application.Common;
using Auction.Contracts.Auction.AuctionItem;
using Auction.Core;
using Auction.Core.Auction.Entities;
using Core;
using FluentResults;
using Microsoft.AspNetCore.Http;

namespace Auction.Application.Auction.AuctionItem;

public interface IAuctionItemService
{
    Task<Result<Core.Auction.Entities.AuctionItem>> GetById(Guid auctionItemId);
    Task<Result<Guid>> AddItem(Guid auctionId, AuctionItemCreateCommand command, Guid ownerId);
    Task<Result> UpdateItem(Guid auctionId, AuctionItemUpdateCommand command, Guid ownerId);
    Task<Result> DeleteItem(Guid auctionId, Guid itemId, Guid ownerId);
    Task<Result<PagedResult<AuctionItemViewModel>>> GetItems(GetAuctionItemsQuery query);
    Task<Result> UpdateDeliveryStatus(Guid auctionId, AuctionItemUpdateDeliveryStatusCommand command, Guid ownerId);
}

public class AuctionItemService(
    IRepository<Core.Auction.Entities.Auction> _repository,
    IRepository<Core.Auction.Entities.AuctionItem> _auctionItemRepository,
    IBlobService _blobService,
    IPublisher _publisher) : IAuctionItemService
{
    public async Task<Result<Core.Auction.Entities.AuctionItem>> GetById(Guid auctionItemId)
    {
        var auctionItem = await _auctionItemRepository.FirstOrDefaultAsync(new AuctionItemByIdAggregateSpec(auctionItemId));
        if (auctionItem is null)
        {
            return Result.Fail("Auction not found");
        }

        return Result.Ok(auctionItem);
    }
    
    public async Task<Result<PagedResult<AuctionItemViewModel>>> GetItems(GetAuctionItemsQuery query)
    {
        var items = await _auctionItemRepository.ListAsync(new AuctionItemsAggregateSpec(query));

        if (!items.Any())
            return new PagedResult<AuctionItemViewModel>();
        
        var result = items.Select(x => x.ToViewModel()).ToList();
        
        return new PagedResult<AuctionItemViewModel>
        {
            Items = result,
            TotalCount = await _auctionItemRepository.CountAsync(new AuctionItemsAggregateSpec(query)),
            Page = query.Page,
            PageSize = query.PageSize
        };
    }

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
        
        if (itemToUpdate.IsSellingNow)
            return Result.Fail($"Auction item with id {command.Id} is already selling now");
        
        if (itemToUpdate.IsSold)
            return Result.Fail($"Auction item with id {command.Id} is already sold");
        
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

    public async Task<Result> UpdateDeliveryStatus(Guid auctionId, AuctionItemUpdateDeliveryStatusCommand command, Guid ownerId)
    {
        var auction = await _repository.SingleOrDefaultAsync(new AuctionByIdAggregateSpec(auctionId));
        if (auction is null)
            return Result.Fail($"There is no auction with id {auctionId}");
        
        if (auction.UserId != ownerId)
            return Result.Fail($"User with id {ownerId} is not owner of this auction");
        
        var itemToUpdate = auction.AuctionItems.Find(x => x.Id == command.Id);
        if (itemToUpdate is null)
            return Result.Fail($"Auction item with id {command.Id} does not exist in this auction");
        
        if (!itemToUpdate.IsSold)
            return Result.Fail($"Auction item with id {command.Id} is not sold yet");
        
        itemToUpdate.DeliveryStatus = command.Status;
        
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