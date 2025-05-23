using Fullstack1.Domain.Entities;
using Fullstack1.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Fullstack1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DepartmentController> _logger;

        public DepartmentController(ApplicationDbContext context, ILogger<DepartmentController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                _logger.LogInformation("Fetching all Departments");

                var departments = await _context.Department.ToListAsync();

                var distinctDepartments = departments
                    .GroupBy(d => d.DepartmentName)
                    .Select(g => g.First())
                    .ToList();

                _logger.LogInformation("Successfully fetched {count} Departments", distinctDepartments.Count);
                return Ok(distinctDepartments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching Departments");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var department = await _context.Department.FindAsync(id);
            if (department == null) return NotFound();
            return Ok(department);
        }


        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Department dep)
        {
            try
            {
                if (dep == null || string.IsNullOrWhiteSpace(dep.DepartmentName) || string.IsNullOrWhiteSpace(dep.Location))
                {
                    _logger.LogWarning("Invalid Department Data");
                    return BadRequest("Invalid Department data. Name and Location are required.");
                }

                var existingDepartment = await _context.Department.FirstOrDefaultAsync(d => d.DepartmentName == dep.DepartmentName);
                if (existingDepartment != null)
                {
                    _logger.LogWarning("Attempt to add a duplicate department: {DepartmentName}", dep.DepartmentName);
                    return Conflict("A Department with this name already exists.");
                }

                _context.Department.Add(dep);
                await _context.SaveChangesAsync();

                //_logger.LogInformation("Department '{DepartmentName}' added successfully", dep.DepartmentName);
                _logger.LogInformation("Received Department: {DepartmentName}, {Location}", dep?.DepartmentName, dep?.Location);

                return Ok("Added Successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a Department");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> Put([FromBody] Department dep)
        {
            try
            {
                if (dep == null || string.IsNullOrWhiteSpace(dep.DepartmentName) || string.IsNullOrWhiteSpace(dep.Location))
                {
                    _logger.LogWarning("Invalid Department Data");
                    return BadRequest("Invalid Department data. Name and Location are required.");
                }

                var existingDepartmentById = await _context.Department.FindAsync(dep.DepartmentId);
                if (existingDepartmentById == null)
                {
                    _logger.LogWarning("Department ID {DepartmentId} not found", dep.DepartmentId);
                    return NotFound("Department not found.");
                }

                var existingDepartmentByName = await _context.Department.FirstOrDefaultAsync(
                    d => d.DepartmentName == dep.DepartmentName && d.DepartmentId != dep.DepartmentId);

                if (existingDepartmentByName != null)
                {
                    _logger.LogWarning("Attempt to update department with duplicate name: {DepartmentName}", dep.DepartmentName);
                    return Conflict("A department with this name already exists.");
                }

                existingDepartmentById.DepartmentName = dep.DepartmentName;
                existingDepartmentById.Location = dep.Location;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Department ID {DepartmentId} updated successfully", dep.DepartmentId);
                return Ok("Department updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating a department");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var department = await _context.Department.FindAsync(id);
                if (department == null)
                {
                    _logger.LogWarning("Attempt to delete a non-existing department with ID {DepartmentId}", id);
                    return NotFound("Department not found.");
                }

                _context.Department.Remove(department);
                await _context.SaveChangesAsync();

                return Ok("Deleted Successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting a department");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}



