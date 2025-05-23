
export const filterFn = (departmentsWithoutFilter, departmentIdFilter, departmentNameFilter, setDepartments) => {
    const filteredData = departmentsWithoutFilter.filter(
      (el) =>
        el.DepartmentId.toString()
          .toLowerCase()
          .includes(departmentIdFilter.toLowerCase().trim()) &&
        el.DepartmentName.toString()
          .toLowerCase()
          .includes(departmentNameFilter.toLowerCase().trim())
    );
    setDepartments(filteredData);
  };
