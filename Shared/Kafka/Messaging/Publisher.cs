using Core;
using KafkaFlow.Producers;
using Newtonsoft.Json;

namespace Kafka.Messaging;

public class Publisher(IProducerAccessor _producerAccessor) : IPublisher
{
    public async Task Publish<TKey, TEvent>(TKey key, TEvent message) where TEvent : IEvent
    {
        var eventName = message.GetType().Name;
        var producer = _producerAccessor.GetProducer(eventName);
        
        await producer.ProduceAsync(eventName, JsonConvert.SerializeObject(key), message);
    }
}