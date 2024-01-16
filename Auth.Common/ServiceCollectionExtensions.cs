using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Shared.Configuration;

namespace Shared;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection @this, IConfiguration configuration)
    {
        var authOptions = new AuthConfiguration();
        configuration.GetSection(AuthConfiguration.Section).Bind(authOptions);
        @this.Configure<AuthConfiguration>(configuration.GetSection(AuthConfiguration.Section));
        
        @this.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = authOptions.Issuer,
                    
                    ValidateAudience = false,

                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authOptions.SecurityKey)),
                    ValidateIssuerSigningKey = true,
                };
            });
        @this.AddAuthorization();
        
        return @this;
    }
}