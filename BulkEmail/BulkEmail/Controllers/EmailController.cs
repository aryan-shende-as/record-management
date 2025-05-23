using BulkEmail.Interfaces;
using BulkEmail.Models;
using Microsoft.AspNetCore.Mvc;

namespace BulkEmail.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly HttpClient _httpClient;

        public EmailController(IEmailService emailService, HttpClient httpClient)
        {
            _emailService = emailService;
            _httpClient = httpClient;
        }

        [HttpPost("send-bulk")]
        public async Task<IActionResult> SendBulk([FromBody] BulkEmailRequest request)
        {
            if (request.Emails == null || !request.Emails.Any() || string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest("Emails and message are required.");
            }

            // Fetch employee emails from the other service
            List<string> employeeEmails;
            try
            {
                var response = await _httpClient.GetAsync("http://localhost:5000/api/employee/emails"); // adjust port & route
                response.EnsureSuccessStatusCode();
                employeeEmails = await response.Content.ReadFromJsonAsync<List<string>>() ?? new List<string>();
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex, "Error fetching employee emails.");
                return StatusCode(500, "Failed to validate employee emails.");
            }

            // Filter valid emails
            var validEmailsToSend = request.Emails
                .Where(email => employeeEmails.Contains(email, StringComparer.OrdinalIgnoreCase))
                .ToList();

            if (!validEmailsToSend.Any())
                return BadRequest("None of the entered emails belong to an employee.");

            string template = "@Model.Content";
            var model = new { Content = request.Message };

            await _emailService.SendBulkEmailsAsync(validEmailsToSend, request.Subject, template, model);

            return Ok("Emails sent successfully.");
        }

    }
}
