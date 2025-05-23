import React, { useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Attendance = () => {
  const [date, setDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [popupStyle, setPopupStyle] = useState({ top: 0, left: 0 });
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const calendarRef = useRef(null);

  const handleDateClick = async (value, event) => {
    setDate(value);
    setShowPopup(true);
    setLoading(true);
    setAttendanceData([]);
    setSelectedEmployee(null); // Clear any previously selected employee

    // Position the popup
    const calendarRect = calendarRef.current.getBoundingClientRect();
    const cellRect = event.target.getBoundingClientRect();
    const top = cellRect.top - calendarRect.top - 40;
    const left = cellRect.left - calendarRect.left + cellRect.width / 2;
    setPopupStyle({
      top: `${top}px`,
      left: `${left}px`,
      transform: "translate(-50%, -100%)",
    });

    // Fetch attendance data from backend
    try {
      const formattedDate = value.toISOString().split("T")[0]; // "YYYY-MM-DD" --> removes time
      const response = await fetch(
        `http://localhost:5000/api/attendance/date/${formattedDate}`
      );

      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      console.log(data);
      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setAttendanceData([]);
    setSelectedEmployee(null); // Close modal if open
  };

  return (
    <div className="flex justify-center items-start p-5 bg-gray-100">
      <div className="bg-white p-4 rounded-2xl shadow-xl relative mt-0">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Attendance Calendar
        </h2>

        <div className="relative" ref={calendarRef}>
          <Calendar
            onClickDay={(value, event) => handleDateClick(value, event)}
            value={date}
            className="rounded-md border-none"
          />

          {showPopup && (
            <div
              className="absolute bg-white border border-gray-300 rounded-md shadow-lg px-4 py-2 text-sm z-50 w-64"
              style={popupStyle}
            >
              <div className="font-medium text-center mb-2">
                {date.toDateString()}
              </div>

              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : attendanceData.length > 0 ? (
                <ul className="space-y-1 max-h-48 overflow-y-auto">
                  {attendanceData.map((entry, index) => {
                    let statusText = "";
                    let statusClass = "";

                    switch (entry.Status) {
                      case 1:
                        statusText = "Present";
                        statusClass = "text-green-600";
                        break;
                      case 2:
                        statusText = "Absent";
                        statusClass = "text-red-600";
                        break;
                      default:
                        statusText = "Not Marked";
                        statusClass = "text-gray-500";
                    }

                    return (
                      <li key={index} className="flex justify-between text-sm">
                        <span
                          className="cursor-pointer text-blue-600 hover:underline"
                          onClick={() => setSelectedEmployee(entry)} // <-- Open modal on click
                        >
                          {entry.EmployeeName}
                        </span>
                        <span className={`font-medium ${statusClass}`}>
                          {statusText}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-center text-gray-500">
                  No attendance records.
                </p>
              )}

              <button
                onClick={closePopup}
                className="mt-2 w-full text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal rendering */}
      {selectedEmployee && (
        <AttendanceModal
          employee={selectedEmployee}
          attendance={attendanceData}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};

export default Attendance;
