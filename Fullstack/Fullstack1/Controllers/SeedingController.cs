using Microsoft.AspNetCore.Mvc;

namespace Fullstack1.Controllers
{
    using Fullstack1.Infrastructure;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using System;

    [ApiController]
    [Route("api/[controller]")]
    public class SeedingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SeedingController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("seed-attendance")]
        public async Task<IActionResult> SeedAttendance()
        {
            await DbSeeder.SeedAttendanceAsync(_context);
            return Ok("Attendance seeded (if not already present).");
        }


        [HttpGet("preview-attendance")]
        public async Task<IActionResult> PreviewAttendance()
        {
            var preview = await _context.Attendances
                .OrderByDescending(a => a.Date)
                .Take(20)
                .Select(a => new
                {
                    a.AttendanceId,
                    a.EmployeeId,
                    a.Date,
                    a.Status,
                    a.Employee.EmployeeName
                })
                .ToListAsync();

            return Ok(preview);
        }


    }



}
