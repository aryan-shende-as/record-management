using Fullstack1.Domain.Entities;
using Fullstack1.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // EF Core namespace

namespace Fullstack1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AttendanceController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /attendance/date/{date}
        [HttpGet("date/{date}")]
        public async Task<IActionResult> GetAttendanceByDate(DateTime date)
        {
            var data = await _context.Attendances
                .Where(a => a.Date.Date == date.Date)
                .Include(a => a.Employee)
                .Select(a => new
                {
                    a.EmployeeId,
                    EmployeeName = a.Employee.EmployeeName,
                    a.Status
                })
                .ToListAsync();

            return Ok(data);
        }

        // GET: /attendance/employee/{employeeId}
        [HttpGet("employee/{employeeId}")]
        public async Task<IActionResult> GetAttendanceByEmployee(int employeeId)
        {
            var data = await _context.Attendances
                .Where(a => a.EmployeeId == employeeId)
                .Select(a => new
                {
                    a.Date,
                    a.Status
                })
                .ToListAsync();

            int present = data.Count(a => a.Status == 1);
            int absent = data.Count(a => a.Status == 2);
            int notMarked = data.Count(a => a.Status == 0);

            return Ok(new
            {
                Summary = new
                {
                    Present = present,
                    Absent = absent,
                    NotMarked = notMarked
                },
                Calendar = data
            });
        }
    }
}
