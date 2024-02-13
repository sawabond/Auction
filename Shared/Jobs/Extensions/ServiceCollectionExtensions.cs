using Core;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Jobs.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddScheduler(this IServiceCollection @this, IConfiguration configuration)
    {
        @this.AddSingleton<IScheduler, HangfireScheduler>();
        
        @this.AddHangfire((sp, config) =>
        {
            config.SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UsePostgreSqlStorage(configuration.GetConnectionString("DefaultConnection"))
                .UseFilter(new AutomaticRetryAttribute { Attempts = 2 } );
        });
        @this.AddHangfireServer(x => x.SchedulePollingInterval = TimeSpan.FromSeconds(3));
        
        return @this;
    }
}