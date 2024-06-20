using Microsoft.AspNetCore.Identity;

namespace Auth.Application.User;

public interface IRoleManagerDecorator
{
    Task<List<IdentityRole>> GetUserRolesById(Guid userId);
}