using Auth.Core.User.Entities;
using Auth.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auth.Web.Controllers;

[Route("api/users")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly AuthDbContext _context;

    public UserController(AuthDbContext context)
    {
        _context = context;
    }
    
    [HttpGet("{userId:guid}")]
    public async Task<IActionResult> GetUser(Guid userId)
    {
        var user = await _context.Users.SingleOrDefaultAsync(x => x.Id == userId.ToString());
        if (user == null)
        {
            return NotFound();
        }
        
        return Ok(user);
    }
    
    [HttpGet("{userId:guid}/role")]
    public async Task<IActionResult> GetRole(Guid userId)
    {
        var userRole = await _context.UserRoles.SingleOrDefaultAsync(x => x.UserId == userId.ToString());
        if (userRole == null)
        {
            return NotFound();
        }

        var role = await _context.Roles.SingleOrDefaultAsync(x => x.Id == userRole.RoleId);
        if (role == null)
        {
            return NotFound();
        }
        
        return Ok(role);
    }
    
    [HttpPut("{userId:guid}/shipment")]
    public async Task<IActionResult> UpsertShippingInformation(Guid userId, [FromBody] ShipmentInformation shipmentInformation)
    {
        var user = await _context.Users.SingleOrDefaultAsync(x => x.Id == userId.ToString());
        if (user == null)
        {
            return NotFound();
        }
        
        user.ShipmentInformation = shipmentInformation;
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
}