namespace BulkEmail.Models
{
    public class BulkEmailRequest
    {
        public List<string> Emails { get; set; } = new();
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

}
