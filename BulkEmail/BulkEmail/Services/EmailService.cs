using BulkEmail.Interfaces;
using FluentEmail.Core;

namespace BulkEmail.Services
{

    public class EmailService : IEmailService
    {
        private readonly IFluentEmailFactory _emailFactory;

        public EmailService(IFluentEmailFactory emailFactory)
        {
            _emailFactory = emailFactory;
        }

        public async Task SendBulkEmailsAsync(List<string> emails, string subject, string template, object model)
        {
            foreach (var email in emails)
            {
                var emailToSend = _emailFactory
                    .Create()
                    .To(email)
                    .Subject(subject)
                    .UsingTemplate(template, model);

                await emailToSend.SendAsync(); // fresh instance each time
            }
        }
    }

}
