using Ardalis.Specification.EntityFrameworkCore;
using Core;

namespace Payment.Infrastructure;

public class Repository<T>(PaymentDbContext context) : RepositoryBase<T>(context), IRepository<T>
    where T : class;