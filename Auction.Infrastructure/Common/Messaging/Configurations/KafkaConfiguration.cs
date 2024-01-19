namespace Auction.Infrastructure.Common.Messaging.Configurations;

public class KafkaConfiguration
{
    public const string Section = "Kafka";

    public IEnumerable<string> BootstrapServers { get; set; } = new List<string>();
    public string ConsumerGroupId { get; set; }
}