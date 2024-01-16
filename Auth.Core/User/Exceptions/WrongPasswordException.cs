
namespace Auth.Core.User.Exceptions;

public class WrongPasswordException() : InvalidOperationException($"Wrong password");