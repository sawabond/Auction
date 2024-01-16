using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Auth.Application.User;
using Auth.Application.User.Login;
using Auth.Core.User.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Shared.Configuration;

namespace Auth.Infrastructure.User.Login;

public class JwtTokenProvider(IOptions<AuthConfiguration> _jwtSettings) : ITokenProvider
{
    private readonly AuthConfiguration _authConfiguration = _jwtSettings.Value;

    public string GetToken(AppUser user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authConfiguration.SecurityKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var tokenOptions = new JwtSecurityToken(
            issuer: _authConfiguration.Issuer,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(_authConfiguration.ExpirationPeriod.Days),
            signingCredentials: credentials
        );

        var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        return token;
    }
}