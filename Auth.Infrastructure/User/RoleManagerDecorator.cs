using Auth.Application.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Auth.Infrastructure.User;

public class RoleManagerDecorator(RoleManager<IdentityRole> _roleManager, AuthDbContext _dbContext) : IRoleManagerDecorator
{
    public async Task<List<IdentityRole>> GetUserRolesById(Guid userId)
    {
        var userRoles = await _dbContext.UserRoles
            .Where(x => x.UserId == userId.ToString())
            .ToListAsync();
        var roles = await _roleManager.Roles
            .Where(x => userRoles
                .Select(x => x.RoleId)
                .Contains(x.Id)
            )
            .ToListAsync();
        
        return roles;
    }
}