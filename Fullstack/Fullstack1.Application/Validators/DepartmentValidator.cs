// Validating wwhile creating a new department or editing an existing department

using FluentValidation;
using Fullstack1.Domain.Entities;

namespace Fullstack1.Application.Validators
{
    public class DepartmentValidator : AbstractValidator<Department>
    {
        public DepartmentValidator()
        {
            // Department name should not be null
            // max length is 20
            RuleFor(e => e.DepartmentName)
                .NotEmpty().WithMessage("Employee Name is required.")
                .MaximumLength(20).WithMessage("Employee Name must be less than 20 characters.");

            // Location should not be null
            // max length is 20
            RuleFor(e => e.Location)
                .NotEmpty().WithMessage("Location is required.")
                .MaximumLength(20).WithMessage("Location must be less than 20 characters.");

        }
    }
}
