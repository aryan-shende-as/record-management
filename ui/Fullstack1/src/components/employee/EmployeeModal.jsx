import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ImageUploader from "./ImageUploader.jsx";

const EmployeeModal = ({
  modalTitle,
  errors: externalErrors,
  employeeName,
  setEmployeeName,
  email, 
  setEmail, 
  setDepartment,
  department,
  departments,
  dateOfJoining,
  setDateOfJoining,
  photoPath,
  photoFileName,
  imageUpload,
  employeeId,
  createClick,
  updateClick,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("employeeName", employeeName);
    setValue("email", email); 
    setValue("department", department);
    setValue("dateOfJoining", dateOfJoining);
  }, [employeeName, email, department, dateOfJoining, setValue]);

  const onSubmit = (data) => {
    if (employeeId === 0) {
      createClick(data);
    } else {
      updateClick(data);
    }
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{modalTitle}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="d-flex flex-row bd-highlight mb-3">
                <div className="p-2 w-50 bd-highlight">
                  {/* Employee Name */}
                  <div className="input-group mb-3">
                    <span className="input-group-text">Employee Name</span>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.employeeName ? "is-invalid" : ""
                      }`}
                      {...register("employeeName", {
                        required: "Employee name is required",
                        onChange: (e) => setEmployeeName(e.target.value),
                      })}
                      value={employeeName}
                    />
                    <div className="invalid-feedback">
                      {errors.employeeName?.message ||
                        externalErrors?.employeeName}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="input-group mb-3">
                    <span className="input-group-text">Email</span>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email format",
                        },
                        onChange: (e) => setEmail(e.target.value),
                      })}
                      value={email}
                    />
                    <div className="invalid-feedback">
                      {errors.email?.message || externalErrors?.email}
                    </div>
                  </div>

                  {/* Department */}
                  <div className="input-group mb-3">
                    <span className="input-group-text">Department</span>
                    <select
                      className={`form-select ${
                        errors.department ? "is-invalid" : ""
                      }`}
                      {...register("department", {
                        required: "Department is required",
                        onChange: (e) => setDepartment(e.target.value),
                      })}
                      value={department}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dep) => (
                        <option key={dep.DepartmentId}>
                          {dep.DepartmentName}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      {errors.department?.message || externalErrors?.department}
                    </div>
                  </div>

                  {/* Date of Joining */}
                  <div className="input-group mb-3">
                    <span className="input-group-text">DOJ</span>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.dateOfJoining ? "is-invalid" : ""
                      }`}
                      {...register("dateOfJoining", {
                        required: "Date of joining is required",
                        onChange: (e) => setDateOfJoining(e.target.value),
                      })}
                      value={dateOfJoining}
                    />
                    <div className="invalid-feedback">
                      {errors.dateOfJoining?.message ||
                        externalErrors?.dateOfJoining}
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="p-2 w-50 bd-highlight">
                  {/* <img
                    width="250px"
                    height="250px"
                    src={photoPath + photoFileName}
                    alt="Employee"
                  />
                  <input className="m-2" type="file" onChange={imageUpload} /> */}
                  <ImageUploader
                    currentImage={photoPath + photoFileName}
                    onImageChange={imageUpload}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary">
                {employeeId === 0 ? "Create" : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
