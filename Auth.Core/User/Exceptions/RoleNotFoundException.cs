namespace Auth.Core.User.Exceptions;

public sealed class RoleNotFoundException(string role)
    : InvalidOperationException($"Role '{role}' was not found");