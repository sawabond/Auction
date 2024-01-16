using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace Logging;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddSerilogLogging(this IServiceCollection @this, IConfiguration configuration)
    {
        @this.AddSerilog((_, logger) =>
        {
            logger.ReadFrom.Configuration(configuration);
        });
        
        return @this;
    }
}