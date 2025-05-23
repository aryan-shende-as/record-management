using FluentEmail.Core;
using Fullstack1.Domain.Entities;
using Fullstack1.Services;
using Microsoft.AspNetCore.Mvc;

namespace Fullstack1.Controllers
{
    // Sending and verification of OTP

    [ApiController]
    [Route("api/[controller]")]
    public class OtpController : ControllerBase
    {
        private readonly IFluentEmail _email;
        private readonly IOtpStorage _otpStorage;

        public OtpController(IFluentEmail email, IOtpStorage otpStorage)
        {
            _email = email;
            _otpStorage = otpStorage;
        }

        // POST api/otp/send
        // Sends a OTP to the given email address
        [HttpPost("send")]
        public async Task<IActionResult> SendOtp([FromBody] OtpRequest request)
        {
            // Generate a random 6-digit OTP
            var otp = new Random().Next(100000, 999999).ToString();

            // Save the OTP against the email for later verification
            _otpStorage.SaveOtp(request.Email, otp);

            // Send the OTP via email
            var response = await _email
                .To(request.Email)
                .Subject("Your OTP Code")
                .Body($"Your OTP is <b>{otp}</b>", isHtml: true)
                .SendAsync();

            return Ok(new { Message = "OTP sent!" });
        }

        // POST api/otp/verify
        // Verifies the submitted OTP against the stored value
        [HttpPost("verify")]
        public IActionResult VerifyOtp([FromBody] OtpVerify request)
        {
            // Validate the OTP using the storage service
            bool isValid = _otpStorage.ValidateOtp(request.Email, request.Otp);
            return isValid ? Ok(new { Message = "OTP verified!" }) : BadRequest("Invalid or expired OTP");
        }
    }
}
