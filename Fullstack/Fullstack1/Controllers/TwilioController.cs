using Fullstack1.Domain.Entities;
using Fullstack1.Services;
using Microsoft.AspNetCore.Mvc;

namespace Fullstack1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TwilioOtpController : ControllerBase
    {
        private readonly ITwilioService _twilioService;
        private static readonly Dictionary<string, string> otps = new(); // For demo

        public TwilioOtpController(ITwilioService twilioService)
        {
            _twilioService = twilioService;
        }

        // POST api/twiliootp/tsend
        // Generates and sends an OTP via SMS using Twilio
        [HttpPost("tsend")]
        public async Task<IActionResult> TwilioSendOtp([FromBody] TwilioOtpRequest request)
        {
            // Generate a 6-digit random OTP
            var otp = new Random().Next(100000, 999999).ToString();

            // Send OTP via Twilio service
            var success = await _twilioService.SendOtpAsync(request.PhoneNumber, otp);

            if (success)
            {
                otps[request.PhoneNumber] = otp; // Store the number till verification is done
                return Ok("OTP sent successfully.");
            }

            return BadRequest("Failed to send OTP.");
        }

        // POST api/twiliootp/tverify
        // Verifies if the submitted OTP matches the stored one
        [HttpPost("tverify")]
        public IActionResult TwilioVerifyOtp([FromBody] TwilioOtpVerification request)
        {
            // Check if OTP exists and matches the stored value
            if (otps.TryGetValue(request.PhoneNumber, out var storedOtp) && storedOtp == request.Otp)
            {
                otps.Remove(request.PhoneNumber); // One-time use
                return Ok("OTP Verified!");
            }

            return BadRequest("Invalid OTP.");
        }
    }
}
