import { variables } from "../Variables";

export const createEmployee = async (employeeName, email, department, dateOfJoining, photoFileName) => {
  const response = await fetch(variables.API_URL + "employee", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      EmployeeName: employeeName,
      Email:email,
      DepartmentName: department,
      DateOfJoining: dateOfJoining,
      PhotoFileName: photoFileName,
    }),
  });

  if (!response.ok) {
    throw response; 
  }
  return response.json();
};


export const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append("File", file); // 'File' must match the DTO property name

  const response = await fetch(variables.API_URL + "employee/SaveFile", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.fileName || data.FileName; // Assuming API returns { FileName: "uploaded.jpg" }
};

export const updateEmployee = async (employeeId, employeeName, email, department, dateOfJoining, photoFileName) => {
  const response = await fetch(variables.API_URL + "employee", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      EmployeeId: employeeId,
      EmployeeName: employeeName,
      Email:email,
      DepartmentName: department,
      DateOfJoining: dateOfJoining,
      PhotoFileName: photoFileName, // Correct: the uploaded file name
    }),
  });

  if (!response.ok) {
    const error = new Error("Failed to update employee");
    error.status = response.status;
    error.body = await response.text(); // optional: helpful for debugging
    throw error;
  }

  return response.json();
};


export  const deleteEmployee = async (id) => {
      await fetch(variables.API_URL + "employee/" + id, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
  };
  
  