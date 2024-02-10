using System.Diagnostics;
using System.Diagnostics.Metrics;
using Castle.DynamicProxy;

namespace Auction.Web.Metrics;

public class TimingInterceptor : IAsyncInterceptor
{
    private static readonly Meter MethodExecutionMeter = new Meter("MethodExecutionMeter", "1.0");
    private static readonly Histogram<double> MethodDurationHistogram = 
        MethodExecutionMeter.CreateHistogram<double>("method_execution_duration", "milliseconds", "Duration of method executions.");

    public void InterceptSynchronous(IInvocation invocation)
    {
        var stopwatch = Stopwatch.StartNew();
        try
        {
            invocation.Proceed();
        }
        finally
        {
            stopwatch.Stop();
            RecordExecution(invocation, stopwatch.Elapsed.TotalMilliseconds);
        }
    }

    public void InterceptAsynchronous(IInvocation invocation)
    {
        invocation.ReturnValue = InternalInterceptAsynchronous(invocation);
    }

    private async Task InternalInterceptAsynchronous(IInvocation invocation)
    {
        var stopwatch = Stopwatch.StartNew();
        try
        {
            invocation.Proceed();
            var task = (Task)invocation.ReturnValue;
            await task.ConfigureAwait(false);
        }
        finally
        {
            stopwatch.Stop();
            RecordExecution(invocation, stopwatch.Elapsed.TotalMilliseconds);
        }
    }

    public void InterceptAsynchronous<TResult>(IInvocation invocation)
    {
        invocation.ReturnValue = InternalInterceptAsynchronous<TResult>(invocation);
    }

    private async Task<TResult> InternalInterceptAsynchronous<TResult>(IInvocation invocation)
    {
        var stopwatch = Stopwatch.StartNew();
        TResult result;
        try
        {
            invocation.Proceed();
            var task = (Task<TResult>)invocation.ReturnValue;
            result = await task.ConfigureAwait(false);
        }
        finally
        {
            stopwatch.Stop();
            RecordExecution(invocation, stopwatch.Elapsed.TotalMilliseconds);
        }

        return result;
    }

    private void RecordExecution(IInvocation invocation, double elapsedMilliseconds)
    {
        MethodDurationHistogram.Record(elapsedMilliseconds,
            new KeyValuePair<string, object>("class", invocation.TargetType.Name),
            new KeyValuePair<string, object>("method", invocation.Method.Name));
    }
}