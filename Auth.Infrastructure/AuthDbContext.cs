using System.ComponentModel.DataAnnotations.Schema;
using Auth.Core.User.Entities;
using Core;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Auth.Infrastructure;

public class AuthDbContext(DbContextOptions<AuthDbContext> _options) : IdentityDbContext<AppUser>(_options)
{
    public DbSet<OutboxMessage> OutboxMessages { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<OutboxMessage>(entity =>
        {
            entity.Property(e => e.Event)
                .HasConversion(
                    v => JsonConvert.SerializeObject(v, new JsonSerializerSettings
                    {
                        TypeNameHandling = TypeNameHandling.All
                    }),
                    v => DeserializeEvent(v)
                );

            entity.Property(e => e.Key)
                .HasConversion(
                    v => JsonConvert.SerializeObject(v, new JsonSerializerSettings
                    {
                        TypeNameHandling = TypeNameHandling.All
                    }),
                    v => JsonConvert.DeserializeObject<object>(v, new JsonSerializerSettings
                    {
                        TypeNameHandling = TypeNameHandling.All
                    }));

        });
    }
    
    private static IEvent DeserializeEvent(string value)
    {
        var jsonObject = JObject.Parse(value);
        var typeName = jsonObject["$type"].ToString();
        var type = Type.GetType(typeName);
        return (IEvent)jsonObject.ToObject(type);
    }
}

public class OutboxMessage
{
    public Guid Id { get; set; }
    public string Type { get; set; }
    [Column(TypeName = "jsonb")]
    public object Key { get; set; }
    [Column(TypeName = "jsonb")]
    public IEvent Event { get; set; }
    public DateTime OccurredOn { get; set; }
    public DateTime? ProcessedAt { get; set; }
}