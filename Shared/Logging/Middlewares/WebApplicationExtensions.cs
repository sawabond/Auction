using Microsoft.AspNetCore.Builder;

namespace Logging.Middlewares;

public static class WebApplicationExtensions
{
    public static IApplicationBuilder UseLoggingMiddleware(this IApplicationBuilder @this)
    {
        return @this.UseMiddleware<LoggingMiddleware>();
    }
}