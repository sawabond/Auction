using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Transfer;
using Auction.Application.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Auction.Infrastructure.Common;

public class AwsS3BucketService(IConfiguration _configuration) : IBlobService
{
    private readonly string _bucketName = "auction-items-photos";
    
    public async Task<(string FileName, Uri Url)> UploadFile(IFormFile file, string fileName)
    {
        try
        {
            var awsCredentials = new BasicAWSCredentials(_configuration["Aws:AccessKey"], _configuration["Aws:SecretKey"]);
            var s3Client = new AmazonS3Client(awsCredentials, Amazon.RegionEndpoint.EUNorth1);
            var transferUtility = new TransferUtility(s3Client);

            var fileKey = $"{Guid.NewGuid()}-{fileName}";

            using (var newMemoryStream = new MemoryStream())
            {
                await file.CopyToAsync(newMemoryStream);
                await transferUtility.UploadAsync(newMemoryStream, _bucketName, fileKey);
            }

            var fileUrl = $"https://{_bucketName}.s3.amazonaws.com/{fileKey}";

            return (fileKey, new Uri(fileUrl));
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Error uploading file to S3", ex);
        }
    }
}