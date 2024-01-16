using Auth.Application.User.Register;
using Auth.Core.User.Entities;
using Riok.Mapperly.Abstractions;

namespace Auth.Application.User;

[Mapper]
public static partial class UserMapper
{
    public static partial AppUser ToEntity(this RegisterUserRequest model);

    public static partial RegisterUserResponse ToResponse(this AppUser model);
}