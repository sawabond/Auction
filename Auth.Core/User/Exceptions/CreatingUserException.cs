using Microsoft.AspNetCore.Identity;

namespace Auth.Core.User.Exceptions;

public class CreatingUserException(IEnumerable<IdentityError> errors)
    : InvalidOperationException(
        $"Failed to create user: {string.Join(", ", errors.Select(error => error.Description))}");