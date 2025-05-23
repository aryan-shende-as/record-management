namespace BulkEmail.Interfaces
{
    public interface IEmailService
    {
        Task SendBulkEmailsAsync(List<string> recipients, string subject, string template, object model);
    }
} 
