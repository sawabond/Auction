using Core;

namespace Auth.Contracts.User;

public class CompensateUserRegisteredEvent : IEvent
{
    public Guid Id { get; set; }
}