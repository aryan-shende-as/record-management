// Email Validation while sending an Otp request

using FluentValidation;
using Fullstack1.Domain.Entities;

namespace Fullstack1.Application.Validators
{
    public class OtpRequestValidator : AbstractValidator<OtpRequest>
    {
        public OtpRequestValidator()
        {
            // Email should be of the correct type and not empty
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");
        }
    }
}
