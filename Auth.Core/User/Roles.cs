using Microsoft.AspNetCore.Identity;

namespace Auth.Core.User;

public static class Roles
{
    public static Dictionary<string, IdentityRole> Map = new()
    {
        { User.Name, new IdentityRole() { Id = User.Id, Name = User.Name, NormalizedName = User.Name.ToUpper() } },
        { Seller.Name, new IdentityRole() { Id = Seller.Id, Name = Seller.Name, NormalizedName = Seller.Name.ToUpper() } }
    };
    
    public static class User
    {
        public const string Name = "User";
        public const string Id = "0847A1EC-A692-4DE7-8429-A0E144421914";
    }
    
    public static class Seller
    {
        public const string Name = "Seller";
        public const string Id = "1847A1EC-A692-4DE7-8429-A0E144421914";
    }
}