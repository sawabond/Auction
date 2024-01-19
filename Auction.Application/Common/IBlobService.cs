using Microsoft.AspNetCore.Http;

namespace Auction.Application.Common;

public interface IBlobService
{
    public Task<(string FileName, Uri Url)> UploadFile(IFormFile file, string fileName);
}