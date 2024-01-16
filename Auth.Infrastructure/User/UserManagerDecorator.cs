using Auth.Application.User;
using Auth.Core.User.Entities;
using Microsoft.AspNetCore.Identity;

namespace Auth.Infrastructure.User;

public class UserManagerDecorator(UserManager<AppUser> _userManager) : IUserManagerDecorator
{
    public Task<AppUser?> FindByEmailAsync(string email)
    {
        return _userManager.FindByEmailAsync(email);
    }

    public Task<IdentityResult> CreateAsync(AppUser user, string password)
    {
        return _userManager.CreateAsync(user, password);
    }

    public Task<bool> CheckPasswordAsync(AppUser user, string password)
    {
        return _userManager.CheckPasswordAsync(user, password);
    }
}