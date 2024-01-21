using System.Linq.Expressions;
using Core;
using Hangfire;

namespace Jobs;

public class HangfireScheduler : IScheduler
{
    public Task Schedule(Expression<Func<Task>> action, TimeSpan delay)
    {
        BackgroundJob.Schedule(action, delay);
        return Task.CompletedTask;
    }
}