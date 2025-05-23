// Forgot password - phone no.

namespace Fullstack1.Domain.Entities
{
    public class TwilioOtpVerification
    {
        public string PhoneNumber { get; set; }
        public string Otp { get; set; }
    }
}
