using Ardalis.Specification;

namespace Payment.Application.Balance.Specifications;

public class BalancesByUserIdsSpec : Specification<Core.Balance>
{
    public BalancesByUserIdsSpec(params Guid[] userIds)
    {
        Query.Where(x => userIds.Contains(x.UserId));
    }
}