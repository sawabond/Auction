using Auth.Application.User.Login;
using Auth.Application.User.Register;
using Auth.Core.User.Exceptions;

namespace Auth.Application.User;

public class AuthService(IUserManagerDecorator _userManager, ITokenProvider _tokenProvider)
{
    public async Task<RegisterUserResponse> Register(RegisterUserRequest registerUserRequest)
    {
        var existingUser = await _userManager.FindByEmailAsync(registerUserRequest.Email);
        if (existingUser != null)
        {
            throw new AlreadyExistingUserException(existingUser.Email);
        }

        var user = registerUserRequest.ToEntity();
        var result = await _userManager.CreateAsync(user, registerUserRequest.Password);

        if (!result.Succeeded)
        {
            throw new CreatingUserException(result.Errors);
        }

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

        var tokenString = _tokenProvider.GetToken(user);

        return new(tokenString);
    }
}