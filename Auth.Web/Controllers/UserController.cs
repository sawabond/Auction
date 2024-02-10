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
            return Ok();
        }
        
        return Ok(user);
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