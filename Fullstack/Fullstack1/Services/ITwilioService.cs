
namespace Fullstack1.Services
{
    //sending OTP messages using Twilio.
    public interface ITwilioService
    {
        //Sends an OTP to the specified phone number using Twilio.
        Task<bool> SendOtpAsync(string toPhoneNumber, string otp);
    }
}
