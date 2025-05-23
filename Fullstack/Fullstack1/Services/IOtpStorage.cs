
namespace Fullstack1.Services
{
    //Defines methods for storing and validating one-time passwords(OTPs).
    public interface IOtpStorage
    {
        // Stores the OTP associated with the specified email address.
        void SaveOtp(string email, string otp);

        // Validates the OTP for the specified email address.
        bool ValidateOtp(string email, string otp);
    }
}
