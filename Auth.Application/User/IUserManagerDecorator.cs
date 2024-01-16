using Auth.Core.User.Entities;
using Microsoft.AspNetCore.Identity;

namespace Auth.Application.User;

public interface IUserManagerDecorator
{
    Task<AppUser?> FindByEmailAsync(string email);

    Task<IdentityResult> CreateAsync(AppUser user, string password);

    Task<bool> CheckPasswordAsync(AppUser user, string password);
}