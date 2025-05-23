import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { variables } from "../Variables.js";
import { employeeSchema } from "../validations/employeeValidation.js";
import EmployeeTable from "../components/employee/EmployeeTable.jsx";
import EmployeeModal from "../components/employee/EmployeeModal.jsx";
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeServices.js";

import { getUserRole } from "../auth/authService";

//new
import AttendanceModal from "../components/employee/AttendanceModal.jsx";

const Employee = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [employeeId, setEmployeeId] = useState(0);
  const [employeeName, setEmployeeName] = useState("");
  const [department, setDepartment] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [photoFileName, setPhotoFileName] = useState("anonymous.png");
  const [photoPath] = useState(variables.PHOTO_URL);
  const [errors, setErrors] = useState({});

  const [email, setEmail] = useState("");

  const [role, setRole] = useState("");

  //new
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  const handleViewAttendance = async (emp) => {
    try {
      const res = await fetch(
        `${variables.API_URL}attendance/employee/${emp.EmployeeId}`
      );
      const data = await res.json();
      setSelectedEmployee(emp);
      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      alert("Failed to fetch attendance");
    }
  };

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  const refreshList = () => {
    fetch(variables.API_URL + "employee")
      .then((response) => response.json())
      .then((data) => setEmployees(data));

    fetch(variables.API_URL + "department")
      .then((response) => response.json())
      .then((data) => setDepartments(data));
  };

  useEffect(() => {
    refreshList();
  }, []);

  const addClick = () => {
    setModalTitle("Add Employee");
    setEmployeeId(0);
    setEmployeeName("");
    setEmail("");
    setDepartment("");
    setDateOfJoining("");
    setPhotoFileName("anonymous.png");
    setErrors({});
  };

  const editClick = (emp) => {
    setModalTitle("Edit Employee");
    setEmployeeId(emp.EmployeeId);
    setEmployeeName(emp.EmployeeName);
    setEmail(emp.Email);
    setDepartment(emp.DepartmentName);
    setDateOfJoining(emp.DateOfJoining);
    setPhotoFileName(emp.PhotoFileName);
    setErrors({});

    const modal = new window.bootstrap.Modal(
      document.getElementById("exampleModal")
    );
    modal.show();
  };

  const validateForm = () => {
    const validationResult = employeeSchema.safeParse({
      employeeName,
      email,
      department,
      dateOfJoining,
    });

    if (!validationResult.success) {
      const formattedErrors = {};
      validationResult.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0]] = issue.message;
      });

      setErrors(formattedErrors);

      setTimeout(() => setErrors({}), 1500);
      return false;
    }
    return true;
  };

  const createClick = async () => {
    if (!validateForm()) return;

    try {
      await createEmployee(
        employeeName,
        email,
        department,
        dateOfJoining,
        photoFileName
      );
      alert("Employee created successfully");
      refreshList();
    } catch (error) {
      if (error.status === 409) {
        alert("Cannot add");
      } else {
        alert("Failed to create employee");
      }
    }
  };

  const updateClick = async () => {
    if (!validateForm()) return;

    try {
      await updateEmployee(
        employeeId,
        employeeName,
        email,
        department,
        dateOfJoining,
        photoFileName
      );
      alert("Employee updated successfully");
      refreshList();
    } catch (error) {
      if (error.status === 409) {
        alert("Employee already exists");
      } else {
        alert("Failed to update employee");
      }
    }
  };

  const deleteClick = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteEmployee(id);
        alert("Deleted");
        refreshList();
      } catch {
        alert("Failed to delete employee");
      }
    }
  };

  const imageUpload = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", e.target.files[0], e.target.files[0].name);

    fetch(variables.API_URL + "employee/savefile", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setPhotoFileName(data);
      });
  };

  const [selectedEmails, setSelectedEmails] = useState([]);

  const toggleEmailSelection = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleSendEmail = () => {
    navigate("/send-bulk", { state: { selectedEmails } });
  };

  return (
    <div>
      <div className="flex justify-end mb-2 gap-2">
        {role === "Admin" && (
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={addClick}
          >
            Add Employee
          </button>
        )}

        <button
          type="button"
          disabled={selectedEmails.length === 0}
          className={`font-medium py-2 px-4 rounded transition ${
            selectedEmails.length === 0
              ? "bg-blue-300 text-blue-100 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          onClick={handleSendEmail}
        >
          Send Email
        </button>
      </div>

      {selectedEmployee && (
        <AttendanceModal
          employee={selectedEmployee}
          attendance={attendanceData}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      <EmployeeTable
        employees={employees}
        editClick={editClick}
        deleteClick={deleteClick}
        selectedEmails={selectedEmails}
        toggleEmailSelection={toggleEmailSelection}
        role={role}
        handleViewAttendance={handleViewAttendance} //new
      />

      <EmployeeModal
        modalTitle={modalTitle}
        errors={errors}
        employeeName={employeeName}
        setEmployeeName={setEmployeeName}
        email={email}
        setEmail={setEmail}
        setDepartment={setDepartment}
        department={department}
        departments={departments}
        dateOfJoining={dateOfJoining}
        setDateOfJoining={setDateOfJoining}
        photoPath={photoPath}
        photoFileName={photoFileName}
        imageUpload={imageUpload}
        employeeId={employeeId}
        createClick={createClick}
        updateClick={updateClick}
      />
    </div>
  );
};

export default Employee;
