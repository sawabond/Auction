using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Auth.Core.User.Entities;

public class AppUser : IdentityUser
{
    [Column(TypeName = "jsonb")]
    public ShipmentInformation? ShipmentInformation { get; set; }
    public List<IdentityUserRole<string>> UserRoles { get; set; } = new();
}

public class ShipmentInformation
{
    public string FirstName { get; set; } = "Oleksandr";
    public string LastName { get; set; } = "Koval";
    public string Patronimic { get; set; } = "Oleksandrovych";
    public string PhoneNumber { get; set; } = "+380123456789";
    public string City { get; set; } = "Kyiv";
    public string Department { get; set; } = "Department #23";
}