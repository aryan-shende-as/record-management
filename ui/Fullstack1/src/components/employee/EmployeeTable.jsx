import { getUserRole } from "../../auth/authService";
import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Calendar } from "lucide-react"; //icons

const EmployeeTable = ({
  employees,
  editClick,
  deleteClick,
  selectedEmails,
  toggleEmailSelection,
  handleViewAttendance,
}) => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full bg-white border border-gray-200 text-gray-700">
        <thead className="bg-gray-100 text-sm font-semibold text-gray-700 uppercase font-sans">
          <tr>
            <th className="px-3 py-2 border-b">Employee ID</th>
            <th className="px-3 py-2 border-b">Employee Name</th>
            <th className="px-3 py-2 border-b">Email</th>
            <th className="px-3 py-2 border-b">Department</th>
            <th className="px-3 py-2 border-b">Date of Joining</th>
            {role === "Admin" && (
              <th className="px-3 py-2 border-b">Options</th>
            )}
          </tr>
        </thead>
        <tbody className="text-[15px]">
          {employees.map((emp, idx) => (
            <tr
              key={emp.EmployeeId}
              className={
                idx % 2 === 0 ? "bg-white" : "bg-blue-50 hover:bg-blue-100"
              }
            >
              <td className="px-3 py-2 border-b">{emp.EmployeeId}</td>
              <td className="px-3 py-2 border-b">{emp.EmployeeName}</td>
              <td className="px-3 py-2 border-b flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedEmails.includes(emp.Email)}
                  onChange={() => toggleEmailSelection(emp.Email)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span>{emp.Email}</span>
              </td>
              <td className="px-3 py-2 border-b">{emp.DepartmentName}</td>
              <td className="px-3 py-2 border-b">{emp.DateOfJoining}</td>
              {role === "Admin" && (
                <td className="px-3 py-2 border-b space-x-2">
                  <button
                    type="button"
                    className="inline-flex items-center p-1.5 rounded hover:bg-blue-100 transition"
                    onClick={() => editClick(emp)}
                    title="Edit"
                  >
                    <Edit2 size={16} className="text-blue-600" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center p-1.5 rounded hover:bg-green-100 transition"
                    title="Attendance Calendar"
                  >
                    <Calendar
                      size={18}
                      className="cursor-pointer text-green-600 hover:text-green-800 ml-2"
                      onClick={() => handleViewAttendance(emp)}
                    />
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center p-1.5 rounded hover:bg-red-100 transition"
                    onClick={() => deleteClick(emp.EmployeeId)}
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
