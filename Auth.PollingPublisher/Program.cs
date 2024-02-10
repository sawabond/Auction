using Auth.Contracts;
using Auth.Infrastructure;
using Auth.PollingPublisher;
using Kafka.Messaging;
using Microsoft.EntityFrameworkCore;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);
NpgsqlConnection.GlobalTypeMapper.EnableDynamicJson();

builder.Services.AddDbContext<AuthDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.AddKafkaInfrastructure(
    handlersAssembly: null,//typeof(AuthInfrastructureAssemblyReference).Assembly,
    eventsAssemblies: typeof(AuthContractsAssemblyReference).Assembly);

builder.Services.AddHostedService<PollingPublisherService>();

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();
