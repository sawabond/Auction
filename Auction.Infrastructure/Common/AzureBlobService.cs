using Auction.Application.Common;
using Microsoft.AspNetCore.Http;

namespace Auction.Infrastructure.Common;

public class AzureBlobService : IBlobService
{
    public Task<(string FileName, Uri Url)> UploadFile(IFormFile file, string fileName)
    {
        return Task.FromResult(($"{fileName}", new Uri($"https://localhost:5001/{fileName}")));
    }
}