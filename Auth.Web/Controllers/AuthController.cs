using Auth.Application.User;
using Auth.Application.User.Login;
using Auth.Application.User.Register;
using Microsoft.AspNetCore.Mvc;

namespace Auth.Web.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody]RegisterUserRequest registerUserRequest)
    {
        var userDto = await authService.Register(registerUserRequest);
        return Ok(userDto);
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login([FromBody] LoginUserRequest userLoginRequest)
    {
        var result = await authService.Login(userLoginRequest);
        return Ok(result);
    }
}