using Fullstack1.Domain.Entities;
using Microsoft.Extensions.Options;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace Fullstack1.Services
{
    //for sending OTP messages via Twilio SMS API.
    public class TwilioService : ITwilioService
    {
        private readonly TwilioSettings _settings;

        // Initializes the Twilio client using the provided settings.
        public TwilioService(IOptions<TwilioSettings> options)
        {
            _settings = options.Value;
            TwilioClient.Init(_settings.AccountSid, _settings.AuthToken);
        }

        // Sends an OTP to the specified phone number using Twilio.
        public async Task<bool> SendOtpAsync(string toPhoneNumber, string otp)
        {
            var message = await MessageResource.CreateAsync(
                to: new PhoneNumber(toPhoneNumber),
                from: new PhoneNumber(_settings.FromPhoneNumber),
                body: $"Your OTP is: {otp}"
            );

            return message.ErrorCode == null;
        }
    }
}
