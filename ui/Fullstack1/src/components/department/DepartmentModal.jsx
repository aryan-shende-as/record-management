import { useEffect } from "react";
import { useForm } from "react-hook-form";

const DepartmentModal = ({
  modalTitle,
  departmentName,
  setDepartmentName,
  location,
  setLocation,
  error,
  departmentId,
  createClick,
  updateClick,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Sync external props to form values
  useEffect(() => {
    setValue("departmentName", departmentName);
    setValue("location", location);
  }, [departmentName, location, setValue]);

  const onSubmit = (data) => {
    if (departmentId === 0) {
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
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Department Name Field */}
              <div className="input-group mb-3">
                <span className="input-group-text">Department Name</span>
                <input
                  type="text"
                  className={`form-control ${
                    error || errors.departmentName ? "is-invalid" : ""
                  }`}
                  {...register("departmentName", {
                    required: "Department name is required",
                    onChange: (e) => setDepartmentName(e.target.value),
                  })}
                />
                <div className="invalid-feedback">
                  {error || errors.departmentName?.message}
                </div>
              </div>

              {/* Location Field */}
              <div className="input-group mb-3">
                <span className="input-group-text">Location</span>
                <input
                  type="text"
                  className={`form-control ${
                    error || errors.location ? "is-invalid" : ""
                  }`}
                  {...register("location", {
                    required: "Location is required",
                    onChange: (e) => setLocation(e.target.value),
                  })}
                />
                <div className="invalid-feedback">
                  {error || errors.location?.message}
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                {departmentId === 0 ? "Create" : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;

