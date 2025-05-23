namespace Fullstack1.Services
{
    // Provides in-memory storage for OTPs with expiration handling.
    public class InMemoryOtpStorage : IOtpStorage
    {
        private readonly Dictionary<string, (string Otp, DateTime Expiry)> _storage = new();

        // Saves the OTP for a specific email along with its expiration time (5 minutes from now).
        public void SaveOtp(string email, string otp)
        {
            _storage[email] = (otp, DateTime.UtcNow.AddMinutes(5));
        }

        // Validates the provided OTP for the given email.
        // Checks if the OTP matches and is not expired.
        // If valid, removes it from storage (one-time use).
        public bool ValidateOtp(string email, string otp)
        {
            if (_storage.TryGetValue(email, out var stored) &&
                stored.Otp == otp && stored.Expiry > DateTime.UtcNow)
            {
                _storage.Remove(email);
                return true;
            }
            return false;
        }
    }
}
