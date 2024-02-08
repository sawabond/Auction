using System.Security.Claims;
using Auction.Application.Auction.AuctionItem;

namespace Auction.Web.Auction.AuctionItem.Get;

public static class GetUserBoughtItems
{
    public const string Route = "/api/user/items";
    public static async Task<IResult> Action(
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