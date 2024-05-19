using Auth.Core.User.Entities;
using Microsoft.AspNetCore.Identity;

namespace Auth.Application.User.Login;

public interface ITokenProvider
{
    string GetToken(AppUser user, IEnumerable<IdentityRole> roles);
}