namespace Core;

public interface IPublisher
{
    Task Publish<TKey, TEvent>(TKey key, TEvent message) where TEvent : IEvent;
}