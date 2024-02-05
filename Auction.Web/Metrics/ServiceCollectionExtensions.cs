using Castle.DynamicProxy;

namespace Auction.Web.Metrics;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection DecorateWithMethodMeasurement<TContract, TImplementation>(
        this IServiceCollection services)
        where TContract : class
        where TImplementation : class, TContract
    {
        var serviceDescriptor = services.FirstOrDefault(sd => sd.ServiceType == typeof(TImplementation));
        if (serviceDescriptor == null)
        {
            throw new InvalidOperationException($"Service implementation {typeof(TImplementation).FullName} is not registered.");
        }

        services.Add(new ServiceDescriptor(typeof(TContract), serviceProvider =>
        {
            var implementation = (TImplementation)serviceProvider.GetService(serviceDescriptor.ImplementationType);
            if (implementation == null)
            {
                throw new InvalidOperationException($"Could not resolve service of type {serviceDescriptor.ImplementationType.FullName}");
            }
            
            var proxyGenerator = new ProxyGenerator();
            
            return proxyGenerator.CreateInterfaceProxyWithTarget<TContract>(implementation, new TimingInterceptor());
        }, serviceDescriptor.Lifetime));

        return services;
    }

}