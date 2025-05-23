import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../auth/authService";
import SignUpPage from "./SignupPage";
import { variables } from "../Variables";



function LoginPage({ setIsLoggedIn }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await login(data.username, data.password);

      if (response.status === 200) {
        setIsLoggedIn(true);
        navigate(variables.HOME_PAGE_URL);
      }
    } catch {
      setErrorMessage("Invalid username or password.");
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 1500);
    }
  };


const handleRedirect = () => {
  navigate('/signup');
};

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "50vh" }}
    >
      <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
        <h4 className="text-center mb-3">Login</h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3 d-flex align-items-center">
            <label className="form-label me-2" style={{ width: "100px" }}>
              Username
            </label>
            <input
              type="text"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username.message}</div>
            )}
          </div>

          <div className="mb-3 d-flex align-items-center">
            <label className="form-label me-2" style={{ width: "100px" }}>
              Password
            </label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          <div className="d-grid gap-2">
            <a href="/forgotpassword">Forgot Password</a>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <button type="button" className="btn btn-primary" onClick={handleRedirect}>
              Sign-Up
            </button>
            
          </div>

          

        </form>
      </div>

      

      {/* Error Modal */}
      {showErrorModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-top">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Login Error</h5>
              </div>
              <div className="modal-body text-center">
                <p>{errorMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;

