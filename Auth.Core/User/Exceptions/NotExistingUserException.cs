namespace Auth.Core.User.Exceptions;

public class NotExistingUserException(string email) 
    : InvalidOperationException($"There is no user with email {email}");
