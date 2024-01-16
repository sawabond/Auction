using Auth.Core.User.Entities;

namespace Auth.Application.User.Login;

public interface ITokenProvider
{
    string GetToken(AppUser user);
}