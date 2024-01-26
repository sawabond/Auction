using Auction.Application.Auction.AuctionItem.Create;
using Auction.Application.Auction.Specifications;
using Auction.Application.Common;
using Auction.Core.Auction.Entities;
using Core;
using FluentResults;
using Microsoft.AspNetCore.Http;

namespace Auction.Application.Auction.AuctionItem;

public interface IAuctionItemService
{
    Task<Result<Guid>> AddItem(Guid auctionId, AuctionItemCreateCommand command, Guid ownerId);
}

public class AuctionItemService(
    IRepository<Core.Auction.Entities.Auction> _repository,
    IBlobService _blobService,
    IPublisher _publisher) : IAuctionItemService
{
    public async Task<Result<Guid>> AddItem(Guid auctionId, AuctionItemCreateCommand command, Guid ownerId)
    {
        var auction = await _repository.SingleOrDefaultAsync(new AuctionByIdWithItemsSpec(auctionId));
        if (auction is null)
        {
            return Result.Fail($"There is no auction with id {auctionId}");
        }
        if (auction.UserId != ownerId)
        {
            return Result.Fail($"User with id {ownerId} is not owner of this auction");
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