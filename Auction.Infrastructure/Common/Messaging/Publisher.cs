using Auction.Core.Common;
using KafkaFlow.Producers;
using Newtonsoft.Json;

namespace Auction.Infrastructure.Common.Messaging;

public class Publisher(IProducerAccessor _producerAccessor) : IPublisher
{
    public async Task Publish<TKey, TEvent>(TKey key, TEvent message) where TEvent : IEvent
    {
        var eventName = typeof(TEvent).Name;
        var producer = _producerAccessor.GetProducer(eventName);
        
        await producer.ProduceAsync(eventName, JsonConvert.SerializeObject(key), message);
    }
}