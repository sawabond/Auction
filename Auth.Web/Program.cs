using Auth.Application.User;
using Auth.Core.User.Entities;
using Auth.Infrastructure;
using Auth.Infrastructure.User;
using Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;
using Shared;

var builder = WebApplication.CreateBuilder(args);

builder.builder.Services.AddCors(x =>
{
    x.AddPolicy("DefaultPolicy", policy =>
    {
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
        policy.AllowAnyMethod();
        policy.SetIsOriginAllowed(_ => true);
    });
});

builder.builder.Services.AddSerilogLogging(builder.Configuration);

builder.builder.Services.AddControllers();

builder.builder.Services.AddJwtAuthentication(builder.Configuration);
builder.builder.Services.AddUserInfrastructure();
builder.builder.Services.AddUserFeature();

builder.builder.Services.AddDbContext<AuthDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.builder.Services.AddIdentityCore<AppUser>()
    .AddEntityFrameworkStores<AuthDbContext>();

builder.builder.Services.AddEndpointsApiExplorer();
builder.builder.Services.AddSwaggerGen(x =>
{
    x.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });
    
    x.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

var app = builder.Build();

app.UseCors("DefaultPolicy");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();

app.UseRouting();

app.UseAuthorization();

app.UseEndpoints(endpoints => endpoints.MapControllers());

app.UseHttpsRedirection();

app.UseSerilogRequestLogging();

app.Run();