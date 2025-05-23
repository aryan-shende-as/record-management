// forgot password - phone no.

namespace Fullstack1.Domain.Entities
{
    public class TwilioSettings
    {
        public string AccountSid { get; set; }
        public string AuthToken { get; set; }
        public string FromPhoneNumber { get; set; }
    }
}
