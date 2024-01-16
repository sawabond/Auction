namespace Auth.Core.User.Exceptions;

public class AlreadyExistingUserException(string email)
    : InvalidOperationException($"User with email {email} already exists");