namespace Auction.Core.Common;

public interface IPublisher
{
    Task Publish<TKey, TEvent>(TKey key, TEvent message) where TEvent : IEvent;
}