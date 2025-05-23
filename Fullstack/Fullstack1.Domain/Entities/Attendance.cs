using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fullstack1.Domain.Entities
{
    public class Attendance
    {
        public int AttendanceId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime Date { get; set; }
        public int Status { get; set; } // 0 = Not Marked, 1 = Present, 2 = Absent

        public Employee Employee { get; set; }
    }


}
