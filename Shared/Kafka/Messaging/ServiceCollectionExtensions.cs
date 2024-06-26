﻿using System.Reflection;
using Core;
using KafkaFlow;
using KafkaFlow.Configuration;
using KafkaFlow.Serializer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using IEvent = Core.IEvent;
using KafkaConfiguration = Kafka.Messaging.Configurations.KafkaConfiguration;

namespace Kafka.Messaging;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddKafkaInfrastructure(
        this WebApplicationBuilder @this,
        Assembly handlersAssembly,
        params Assembly[] eventsAssemblies)
    {
        @this.Services.Configure<KafkaConfiguration>(@this.Configuration.GetSection(KafkaConfiguration.Section));
        var kafkaConfig = new KafkaConfiguration();
        @this.Configuration.Bind(KafkaConfiguration.Section, kafkaConfig);

        @this.Services.AddScoped(typeof(IPublisher), typeof(Publisher));

        @this.Services.AddKafka(kafka => kafka
            .UseConsoleLog()
            .AddCluster(cluster =>
            {
                var configurationBuilder = cluster.WithBrokers(kafkaConfig.BootstrapServers)
                    .WithSecurityInformation(x =>
                    {
                        x.SaslMechanism = SaslMechanism.Plain;
                        x.SecurityProtocol = SecurityProtocol.SaslSsl;
                        x.SaslUsername = "V7XKED2OQRIP4GZ6";
                        x.SaslPassword = "Eaz/ooixsrf8jG5D61kJ5zd12Qxv777Gsyp9xkVeUzxTkAxCS0AtU+z/pdYSzBWA";
                    });
                
                var events = eventsAssemblies.SelectMany(GetEvents);
                var handlers = GetHandlers(handlersAssembly);
                
                foreach (var @event in events)
                {
                    configurationBuilder.CreateTopicIfNotExists(@event.Name, 1, 3);
                    
                    configurationBuilder.AddProducer(
                        @event.Name,
                        producer => producer
                            .DefaultTopic(@event.Name)
                            .AddMiddlewares(m =>
                                m.AddSerializer<JsonCoreSerializer>()
                            )
                    );
                    
                    var handlersToRegisterForConsumer = handlers
                        .Where(x => x.GetInterfaces().Any(i => 
                            i.IsGenericType 
                            && i.GetGenericTypeDefinition() == typeof(IMessageHandler<>)
                            && i.GetGenericArguments()[0] == @event))
                        .ToList();
                    
                    configurationBuilder.AddConsumer(consumer => consumer
                        .Topic(@event.Name)
                        .WithGroupId(kafkaConfig.ConsumerGroupId)
                        .WithBufferSize(10)
                        .WithWorkersCount(10)
                        .WithAutoOffsetReset(AutoOffsetReset.Earliest)
                        .AddMiddlewares(middlewares =>
                        {
                            middlewares.AddDeserializer<JsonCoreDeserializer>();
                            middlewares.AddTypedHandlers(x => x.AddHandlers(handlersToRegisterForConsumer));
                        })
                    );
                }
            })
        );

        var bus = @this.Services.BuildServiceProvider().CreateKafkaBus();
        bus.StartAsync();

        return @this.Services;
    }

    private static IEnumerable<Type> GetHandlers(Assembly handlersAssembly)
    {
        return handlersAssembly
            .GetTypes()
            .Where(t => t.GetInterfaces().Any(i => 
                i.IsGenericType 
                && i.GetGenericTypeDefinition() == typeof(IMessageHandler<>)));
    }

    private static IEnumerable<Type> GetEvents(Assembly eventsAssembly)
    {
        var events = eventsAssembly
            .GetTypes()
            .Where(x => x.IsAssignableTo(typeof(IEvent)));

        return events;
    }
}