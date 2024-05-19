using Core.Exceptions;
using Microsoft.AspNetCore.Builder;

namespace Core;

public static class ServiceCollectionExtensions
{
    public static void UseGlobalExceptionHandler(this IApplicationBuilder app)
    {
        app.UseMiddleware<ExceptionHandlingMiddleware>();
    }
}