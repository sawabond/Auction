using Ardalis.Specification;

namespace Core;

public interface IRepository<T> : IRepositoryBase<T> where T : class
{
    
}