using Auth.Application.User.Login;
using Auth.Application.User.Register;
using Auth.Contracts.User;
using Auth.Core.User;
using Auth.Core.User.Exceptions;
using Core;
using Microsoft.AspNetCore.Identity;

namespace Auth.Application.User;

public class AuthService(
    IRoleManagerDecorator _roleManager,
    IUserManagerDecorator _userManager,
    ITokenProvider _tokenProvider,
    IPublisher _publisher)
{
    public async Task<RegisterUserResponse> Register(RegisterUserRequest registerUserRequest)
    {
        var existingUser = await _userManager.FindByEmailAsync(registerUserRequest.Email);
        if (existingUser != null)
        {
            throw new AlreadyExistingUserException(existingUser.Email);
        }

        var user = registerUserRequest.ToEntity();
        user.UserName = registerUserRequest.Email;

        if (Roles.Map.TryGetValue(registerUserRequest.Role, out var role))
            user.UserRoles.Add(
                new()
                {
                    RoleId = role.Id,
                    UserId = user.Id
                });
        else
            throw new RoleNotFoundException(registerUserRequest.Role);
        
        var result = await _userManager.CreateAsync(user, registerUserRequest.Password);

        if (!result.Succeeded)
        {
            throw new CreatingUserException(result.Errors);
        }
        
        await _publisher.Publish(user.Id, new UserRegisteredEvent
        {
            Id = Guid.Parse(user.Id),
            Role = registerUserRequest.Role
        });

        return user.ToResponse();
    }

    public async Task<LoginResponse> Login(LoginUserRequest loginUserRequest)
    {
        var user = await _userManager.FindByEmailAsync(loginUserRequest.Email);

        if (user == null)
        {
            throw new NotExistingUserException(loginUserRequest.Email);
        }

        var passwordMatches = await _userManager.CheckPasswordAsync(user, loginUserRequest.Password);

        if (!passwordMatches)
        {
            throw new WrongPasswordException();
        }

        var roles = await _roleManager.GetUserRolesById(Guid.Parse(user.Id));

        var tokenString = _tokenProvider.GetToken(user, roles);

        return new(tokenString);
    }
}