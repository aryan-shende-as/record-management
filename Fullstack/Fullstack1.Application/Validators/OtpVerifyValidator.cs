// Email and Otp validation while Otp verification

using FluentValidation;
using Fullstack1.Domain.Entities;

namespace Fullstack1.Application.Validators
{
    public class OtpVerifyValidator : AbstractValidator<OtpVerify>
    {
        public OtpVerifyValidator()
        {
            // Email should be of the correct format and not empty
            RuleFor(x => x.Email)
                .NotEmpty().EmailAddress();

            // Length of the Otp should be exactly 6
            RuleFor(x => x.Otp)
                .NotEmpty().Length(6);
        }
    }
}
