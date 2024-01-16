namespace Auth.Application.User.Register;

public record RegisterUserRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}