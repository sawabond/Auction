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
                options.Events = new()
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"].FirstOrDefault();
        
                        if (!string.IsNullOrEmpty(accessToken))
                        {
                            var path = context.HttpContext.Request.Path;

                            if (path.StartsWithSegments("/auction-hub"))
                            {
                                context.Token = accessToken;
                            }
                        }

                        return Task.CompletedTask;
                    }
                };
            });
        @this.AddAuthorization();
        
        return @this;
    }
}