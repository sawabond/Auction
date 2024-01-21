using System.Linq.Expressions;

namespace Core;

public interface IScheduler
{
    Task Schedule(Expression<Func<Task>> action, TimeSpan delay);
}