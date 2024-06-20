using System.Security.Claims;
using Auction.Application.Auction.AuctionItem;
using Microsoft.AspNetCore.Mvc;

namespace Auction.Web.Auction.AuctionItem.Get;

public class GetAuctionItems
{
    public const string Route = "/api/auctions/{auctionId:guid}/items";
    public static async Task<IResult> Action(
        [FromRoute] Guid auctionId,
        [AsParameters] GetAuctionItemsRequest request,
        [FromServices] IAuctionItemService auctionItemService)
    {
        var result = await auctionItemService.GetItems(request.ToQuery() with { AuctionId = auctionId });

        if (result.IsSuccess)
        {
            return Results.Ok(result.Value);
        }

        return Results.BadRequest();
    }
}