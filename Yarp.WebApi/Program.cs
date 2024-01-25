using Logging;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSerilogLogging(builder.Configuration);

builder.Services.AddCors(x =>
{
    x.AddPolicy("DefaultPolicy", options =>
    {
        options.SetIsOriginAllowed(_ => true)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.UseCors("DefaultPolicy");

app.MapReverseProxy();

app.Run();