using Microsoft.Extensions.DependencyInjection;

namespace Auth.Application.User;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddUserFeature(this IServiceCollection @this)
    {
        @this.AddScoped<AuthService>();

        return @this;
    }
}