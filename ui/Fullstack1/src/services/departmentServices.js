import { variables } from "../Variables";
const token = localStorage.getItem("token");

// CREATE Department
export const createDepartment = async (departmentName, location) => {
  console.log("Creating department:", departmentName, location);
  
  const response = await fetch(variables.API_URL + "department", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      DepartmentName: departmentName,
      Location: location,
    }),
  });
  
  // console.log("Creating department:", departmentName, location);
  if (!response.ok) {
    throw response;
  }

  // return response.json();
};

// EDIT CLICK
export const editClick = (
  dep,
  setModalTitle,
  setDepartmentId,
  setDepartmentName,
  setLocation,
  setError
) => {
  setModalTitle("Edit Department");
  setDepartmentId(dep.departmentId);
  setDepartmentName(dep.departmentName);
  setLocation(dep.location);
  setError("");
};

// UPDATE Department
export const updateDepartment = async (departmentId, departmentName, location) => {
  const response = await fetch(variables.API_URL + "department", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      DepartmentId: departmentId,
      DepartmentName: departmentName,
      Location: location,
    }),
    
  });
  // console.log("Updating department:", departmentId, departmentName, location);

  if (!response.ok) {
    throw response;
  }

  return response.json();
};

// DELETE Department
export const deleteDepartment = (id) => {
  fetch(variables.API_URL + "department/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
};
