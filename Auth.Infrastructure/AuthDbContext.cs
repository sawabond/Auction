using Auth.Core.User.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Auth.Infrastructure;

public class AuthDbContext(DbContextOptions<AuthDbContext> _options) : IdentityDbContext<AppUser>(_options)
{
}