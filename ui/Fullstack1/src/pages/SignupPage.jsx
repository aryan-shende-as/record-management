import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance"; // Ensure this is configured

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [inputError, setInputError] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage("All fields are required.");
      setShowErrorModal(true);
      setInputError(true);

      setTimeout(() => {
        setShowErrorModal(false);
        setInputError(false);
      }, 1500);
      return;
    }

    try {
      const response = await axios.post("/auth/signup", {
        username,
        password,
      });

      if (response.status === 200) {
        // Registration successful
        navigate("/login");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data || "Registration failed. Try a different username."
      );
      setShowErrorModal(true);

      setTimeout(() => {
        setShowErrorModal(false);
      }, 2000);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "50vh" }}
    >
      <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
        <h4 className="text-center mb-3">Sign Up</h4>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3 d-flex align-items-center">
            <label className="form-label me-2" style={{ width: "100px" }}>
              Username
            </label>
            <input
              type="text"
              className={`form-control ${
                inputError && !username.trim() ? "is-invalid" : ""
              }`}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3 d-flex align-items-center">
            <label className="form-label me-2" style={{ width: "100px" }}>
              Password
            </label>
            <input
              type="password"
              className={`form-control ${
                inputError && !password.trim() ? "is-invalid" : ""
              }`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="d-grid gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLogin}
            >
              Back
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
                <h5 className="modal-title text-danger">Sign Up Error</h5>
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

export default SignUpPage;
