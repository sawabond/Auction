using System.Text;

namespace Auction.Application.Auction.Helpers;

public static class CursorConverter
{
    public static DateTime? ToDateTimeCursor(this string encodedCursor)
    {
        if (string.IsNullOrWhiteSpace(encodedCursor))
        {
            return null;
        }
        
        var bytes = Convert.FromBase64String(encodedCursor);
        var dateTimeOffsetString = Encoding.UTF8.GetString(bytes);
        
        return DateTime.Parse(dateTimeOffsetString, null, System.Globalization.DateTimeStyles.RoundtripKind);
    }
    
    public static string ToCursor(this DateTime cursor)
    {
        byte[] bytes = Encoding.UTF8.GetBytes(cursor.ToString("o"));
        
        return Convert.ToBase64String(bytes);
    }
}