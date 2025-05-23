using Fullstack1.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading.Tasks;
using System.Linq;
using Fullstack1.Infrastructure;
using System.Globalization;
using System.Runtime.Intrinsics.Arm;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Fullstack1.Controllers
{
    // CRUD operations on the Employee Schema

    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<EmployeeController> _logger;

        public EmployeeController(ApplicationDbContext context, IWebHostEnvironment env, ILogger<EmployeeController> logger)
        {
            _context = context;
            _env = env;
            _logger = logger;
        }

        // GET: api/employee
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                _logger.LogInformation("Fetching all Employees");
                // Retrieve all employee records from the database
                var employees = await _context.Employee.ToListAsync();

                // Remove duplicate records based on EmployeeName, DepartmentName, and DateOfJoining
                var distinctEmployees = employees
                    .GroupBy(e => new { e.EmployeeName, e.Email, e.DepartmentName, e.DateOfJoining.Date }) // Remove duplicates
                    .Select(g => g.First()) // Pick the first occurrence in each group
                    .Select(e => new
                    {
                        e.EmployeeId,
                        e.EmployeeName,
                        e.Email,
                        e.DepartmentName,
                        DateOfJoining = e.DateOfJoining.ToString("yyyy-MM-dd"), // Format date correctly
                        e.PhotoFileName
                    })
                    .ToList();

                _logger.LogInformation("Successfully fetched {count} Employees", distinctEmployees.Count);
                return Ok(distinctEmployees);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "An error occured while fetching Employees");
                return StatusCode(500, "Internal Server Error");
            }

        }


        [HttpGet("emails")]
        public async Task<IActionResult> GetEmployeeEmails([FromQuery] string? query)
        {
            try
            {
                _logger.LogInformation("Fetching employee emails with query: {Query}", query ?? "[No Query]");

                IQueryable<string> emailQuery = _context.Employee.Select(e => e.Email);

                if (!string.IsNullOrWhiteSpace(query))
                {
                    // Apply filter for autocomplete
                    emailQuery = emailQuery
                        .Where(email => email.ToLower().Contains(query.ToLower()))
                        .Take(10);
                }

                var emails = await emailQuery
                    .Distinct()
                    .ToListAsync();

                return Ok(emails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching employee emails");
                return StatusCode(500, "Internal Server Error");
            }
        }




        // POST: api/employee
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Employee emp)
        {
            try
            {
                if (emp == null)
                {
                    _logger.LogWarning("Invalid Employee Data");
                    return BadRequest("Invalid employee data.");
                }

                // Check for existing employee with same name, department, and joining date
                var existingEmployee = await _context.Employee.FirstOrDefaultAsync(e => e.EmployeeName == emp.EmployeeName && e.DateOfJoining == emp.DateOfJoining && e.DepartmentName == emp.DepartmentName && e.Email == emp.Email);

                if (existingEmployee != null)
                {
                    // If the employee exists with the same Name department and DOJ, return a Conflict response
                    _logger.LogWarning("Duplicate employee entry attempted: {EmployeeName}, {DepartmentName}, {DateOfJoining}, {Email}",
                        emp.EmployeeName, emp.DepartmentName, emp.DateOfJoining, emp.Email);
                    return Conflict("Employee already exists.");
                }

                // Add new employee to the database
                await _context.Employee.AddAsync(emp);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Employee {EmployeeName} added successfully in {DepartmentName}",
                    emp.EmployeeName, emp.DepartmentName);
                return Ok("Added Successfully");
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error while adding Employee {EmployeeName}", emp.EmployeeName);
                return StatusCode(500, "Internal Server Error");
            }
        }

        // PUT: api/employee
        [HttpPut]
        public async Task<IActionResult> Put([FromBody] Employee emp)
        {
            try
            {
                if (emp == null || emp.EmployeeId == 0)
                {
                    _logger.LogWarning("Invalid employee data.");
                    return BadRequest("Invalid employee data.");
                }

                // Fetch the existing employee from the database
                // Find employee by ID  
                var existingEmployee = await _context.Employee.FindAsync(emp.EmployeeId);
                if (existingEmployee == null)
                {
                    _logger.LogWarning("Employee not found.");
                    return NotFound("Employee not found.");
                }

                // Check for duplicate employee (excluding current one)
                var duplicateEmployee = await _context.Employee.AnyAsync(e =>
                    e.EmployeeName == emp.EmployeeName &&
                    e.Email == emp.Email &&
                    e.EmployeeId != emp.EmployeeId); // Ensure it's not the same employee

                if (duplicateEmployee)
                {
                    _logger.LogWarning("Employee not found with ID {EmployeeId}", emp.EmployeeId);
                    return NotFound("Employee not found.");
                }


                // Update only the necessary fields
                _context.Entry(existingEmployee).CurrentValues.SetValues(emp);

                await _context.SaveChangesAsync();

                _logger.LogInformation("Employee {employeeName} updated successfully",emp.EmployeeName);
                return Ok("Updated Successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while updating Employee {EmployeeId}", emp.EmployeeId);
                return StatusCode(500, "Internal Server Error");
            }
        }


        // DELETE: api/employee/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                // Find employee by ID
                var employee = await _context.Employee.FindAsync(id);
                if (employee == null)
                {
                    _logger.LogWarning("Attempted to delete non-existing Employee {EmployeeId}", id);
                    return NotFound("Employee not found.");
                }

                // Remove employee from the database
                _context.Employee.Remove(employee);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Employee {employeeId} deleted Successfully", id);
                return Ok("Deleted Successfully");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while deleting Employee {EmployeeId}", id);
                return StatusCode(500, "Internal Server Error");
            }
        }

        // POST: api/employee/SaveFile
        [Route("SaveFile")]
        [HttpPost]
        public async Task<IActionResult> SaveFile([FromForm] FileUploadDto fileUploadDto)
        {
            try
            {
                if (fileUploadDto.File == null || fileUploadDto.File.Length == 0)
                {
                    return BadRequest("No file uploaded or file is empty.");
                }

                // Validate file extension
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtension = Path.GetExtension(fileUploadDto.File.FileName).ToLower();

                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest("Invalid file type. Only image files are allowed.");
                }

                // Create "Photos" directory if it doesn't exist
                var photosPath = Path.Combine(_env.ContentRootPath, "Photos");
                if (!Directory.Exists(photosPath))
                {
                    Directory.CreateDirectory(photosPath);
                }

                var filename = Path.GetFileName(fileUploadDto.File.FileName);
                var physicalPath = Path.Combine(photosPath, filename);

                using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    await fileUploadDto.File.CopyToAsync(stream);
                }

                return Ok(new { FileName = filename, Message = "File uploaded successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}