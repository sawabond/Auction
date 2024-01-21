namespace Auth.Application.User.Register;

public record RegisterUserRequest
{
    public string Name { get; set; }
    
    public string Surname { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}