using System.Security.Claims;
using Auction.Application.Auction.AuctionItem;
using Auction.Application.Auction.AuctionItem.Update;
using Microsoft.AspNetCore.Mvc;

namespace Auction.Web.Auction.AuctionItem.Update;

public static class UpdateDeliveryStatus
{
    public const string Route = "/api/auctions/{auctionId:guid}/items";
    public static async Task<IResult> Action(
        [FromRoute] Guid auctionId,
        [FromBody] AuctionItemUpdateDeliveryStatusCommand request,
        ClaimsPrincipal user,
        IAuctionItemService auctionItemService)
    {
        var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier));
        var result = await auctionItemService.UpdateDeliveryStatus(auctionId, request, userId);

        if (result.IsSuccess)
        {
            return Results.NoContent();
        }

        return Results.BadRequest(result.Errors.First().Message);
    }
}