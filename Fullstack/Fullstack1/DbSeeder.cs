using Fullstack1.Domain.Entities;
using Fullstack1.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Fullstack1
{

public static class DbSeeder
    {
        public static async Task SeedAttendanceAsync(ApplicationDbContext context)
        {
            if (!context.Attendances.Any())
            {
                var employees = await context.Employee.ToListAsync();
                var random = new Random();

                var records = new List<Attendance>();

                foreach (var emp in employees)
                {
                    for (int i = 0; i < 30; i++)
                    {
                        var date = DateTime.Today.AddDays(-i);

                        records.Add(new Attendance
                        {
                            EmployeeId = emp.EmployeeId,
                            Date = date,
                            Status = random.Next(0, 3) // 0 = NotMarked, 1 = Present, 2 = Absent
                        });
                    }
                }

                context.Attendances.AddRange(records);
                await context.SaveChangesAsync();
            }
        }
    }
}
