import React from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const AttendanceModal = ({ employee, attendance, onClose }) => {
  const attendanceDates = attendance.Calendar || [];

  const getTileClass = ({ date, view }) => {
    if (view !== 'month') return;

    const day = attendanceDates.find(d => {
      const d1 = new Date(d.Date).toDateString();
      const d2 = date.toDateString();
      return d1 === d2;
    });

    if (!day) return "";
    if (day.Status === 1) return "present-day";
    if (day.Status === 2) return "absent-day";
    return "";
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="font-semibold text-lg mb-4">
          Attendance Calendar: {employee.EmployeeName}
        </h2>
        <Calendar tileClassName={getTileClass} />
        <button
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AttendanceModal;
