// Employee Schema

namespace Fullstack1.Domain.Entities
{
    public class Employee
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string  Email { get; set; }
        public string DepartmentName { get; set; }
        public DateTime DateOfJoining { get; set; }
        public string PhotoFileName { get; set; }


        public ICollection<Attendance> Attendances { get; set; } //linking to attendance


    }
}
