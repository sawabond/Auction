using Auth.Application.User;
using Auth.Application.User.Login;
using Auth.Infrastructure.User.Login;
using Microsoft.Extensions.DependencyInjection;

namespace Auth.Infrastructure.User;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddUserInfrastructure(this IServiceCollection @this)
    {
        @this.AddScoped<IUserManagerDecorator, UserManagerDecorator>();
        @this.AddScoped<IRoleManagerDecorator, RoleManagerDecorator>();
        @this.AddScoped<ITokenProvider, JwtTokenProvider>();

        return @this;
    }
}