﻿using Core;

namespace Auth.Contracts.User;

public class UserRegisteredEvent : IEvent
{
    public Guid Id { get; set; }
}