using System.Security.Claims;
using Auction.Application.Auction.AuctionItem;
using Auction.Web.Auction.AuctionItem.Get;
using Microsoft.AspNetCore.Mvc;

namespace Auction.Web.Auction.AuctionItem;

public static class AuctionItemEndpoints
{
    public const string Route = "/api/user/items";
    
    public static async Task<IResult> GetUserBoughtItems(
        [AsParameters] GetAuctionItemsRequest request, 
        ClaimsPrincipal user,
        IAuctionItemService auctionItemService)
    {
        var userId = Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier));
        var result = await auctionItemService.GetItems(request.ToQuery() with { UserId = userId });

        if (result.IsSuccess)
        {
            return Results.Ok(result.Value);
        }

        return Results.BadRequest();
    }
}