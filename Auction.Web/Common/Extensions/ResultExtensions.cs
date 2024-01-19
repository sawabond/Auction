using FluentResults;

namespace Auction.Web.Common.Extensions;

internal static class ResultExtensions
{
    public static IResult ToResponse<T>(this Result<T> @this)
        => @this.IsSuccess
            ? TypedResults.Ok(@this.Value)
            : TypedResults.BadRequest(string.Join(Environment.NewLine, @this.Errors));
}