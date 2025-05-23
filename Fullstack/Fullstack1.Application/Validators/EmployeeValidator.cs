// Validating while creating and editing an employee

using FluentValidation;
using Fullstack1.Domain.Entities;

namespace Fullstack1.Application.Validators
{
    public class EmployeeValidator : AbstractValidator<Employee>
    {
        public EmployeeValidator()
        {
            // Employee name should not be null
            // max length is 20
            RuleFor(e => e.EmployeeName)
                .NotEmpty().WithMessage("Employee Name is required.")
                .MaximumLength(20).WithMessage("Employee Name must be less than 20 characters.");

            // Email should not be null
            // max length is 30
            RuleFor(e => e.Email)
                .NotEmpty().WithMessage("Email is Required")
                .EmailAddress().WithMessage("Invalid email format.")
                .MaximumLength(30).WithMessage("Email must be less than 30 characters.");

            // Department name should not be null
            // max length is 20
            RuleFor(e => e.DepartmentName)
                .NotEmpty().WithMessage("Department Name is required.")
                .MaximumLength(20).WithMessage("Department Name must be less than 20 characters.");

            // Date of Joining should not be empty
            RuleFor(e => e.DateOfJoining)
                .NotEmpty().WithMessage("Date of Joining is required.")
                .Must(date => date != default(DateTime)).WithMessage("Date of Joining must be a valid date.");

            RuleFor(e => e.PhotoFileName)
                .NotEmpty().WithMessage("Photo File Name is required.")
                .Matches(@"^[\w,\s-]+\.[A-Za-z]{3,4}$").WithMessage("Invalid file name format.");
        }
    }
}

