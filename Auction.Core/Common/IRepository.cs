using Ardalis.Specification;

namespace Auction.Core.Common;

public interface IRepository<T> : IRepositoryBase<T> where T : class
{
    
}