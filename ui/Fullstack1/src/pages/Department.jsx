import React, { useState, useEffect } from "react";
import { variables } from "../Variables";
import { departmentSchema } from "../validations/departmentValidation";

import DepartmentTable from "../components/department/DepartmentTable";
import DepartmentModal from "../components/department/DepartmentModal";

import { getUserRole } from "../auth/authService";
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/departmentServices";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentsWithoutFilter, setDepartmentsWithoutFilter] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalTitle, setModalTitle] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [location, setLocation] = useState("");
  const [departmentId, setDepartmentId] = useState(0);
  const [error, setError] = useState("");

  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    fetch(variables.API_URL + "department")
      .then((response) => response.json())
      .then((data) => {
        setDepartments(data);
        setDepartmentsWithoutFilter(data);
      });
  };

  useEffect(() => {
    const filtered = departmentsWithoutFilter.filter((dept) => {
      const query = searchQuery.toLowerCase();
      return (
        dept.DepartmentId.toString().toLowerCase().includes(query) ||
        dept.DepartmentName.toLowerCase().includes(query) ||
        dept.Location.toLowerCase().includes(query)
      );
    });
    setDepartments(filtered);
  }, [searchQuery, departmentsWithoutFilter]);

  const validateForm = () => {
    const validationResult = departmentSchema.safeParse({
      departmentName,
      location,
    });

    if (!validationResult.success) {
      setError(validationResult.error.issues[0].message);
      setTimeout(() => setError(""), 1500);
      return false;
    }

    return true;
  };

  const createClick = async () => {
    if (!validateForm()) return;

    try {
      await createDepartment(departmentName, location);
      alert("Department added successfully");
      refreshList();
    } catch (error) {
      if (error.status === 409) {
        alert("Department already exists");
      } else {
        console.log(error);
        alert("Failed to add department");
      }
    }
  };

  const editClick = (dep) => {
    setModalTitle("Edit Department");
    setDepartmentId(dep.DepartmentId);
    setDepartmentName(dep.DepartmentName);
    setLocation(dep.Location);
    setError("");
  };

  const updateClick = async () => {
    if (!validateForm()) return;

    try {
      await updateDepartment(departmentId, departmentName, location);
      alert("Department updated successfully");
      refreshList();
    } catch (error) {
      if (error.status === 409) {
        alert("Cannot update");
      } else {
        alert("Failed to update department");
      }
    }
  };

  const deleteClick = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteDepartment(id);
        alert("Department deleted successfully");
        refreshList();
      } catch {
        alert("Failed to delete department");
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search departments..."
          className="form-control me-2"
          style={{ maxWidth: "300px" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {role === "Admin" && (
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={() => {
              setModalTitle("Add Department");
              setDepartmentId(0);
              setDepartmentName("");
              setLocation("");
              setError("");
            }}
          >
            Add Department
          </button>
        )}
      </div>

      <DepartmentTable
        departments={departments}
        editClick={editClick}
        deleteClick={deleteClick}
      />
      <DepartmentModal
        modalTitle={modalTitle}
        departmentName={departmentName}
        setDepartmentName={setDepartmentName}
        location={location}
        setLocation={setLocation}
        error={error}
        departmentId={departmentId}
        createClick={createClick}
        updateClick={updateClick}
      />
    </div>
  );
};

export default Department;
