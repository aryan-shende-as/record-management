import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Department from "./pages/Department";
import Employee from "./pages/Employee";
import Location from "./components/map/Location";
import BulkEmailForm from "./pages/BulkEmail";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import GitHubAuth from "./components/socialLogins/GitHubAuth";
import GoogleAuth from "./components/socialLogins/GoogleAuth";

import HeaderComponent from "./components/header/HeaderComponent";
import NavbarComponent from "./components/NavbarComponent";
import LogoutComponent from "./components/LogoutComponent";

import Attendance from "./pages/Attendance";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSignUpSuccessModal, setShowSignUpSuccessModal] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogoutModal(true);

    setTimeout(() => {
      setShowLogoutModal(false);
    }, 1500);
  };

  const handleSignUpSuccess = () => {
    setShowSignUpSuccessModal(true);

    setTimeout(() => {
      setShowSignUpSuccessModal(false);
      window.location.href = "/login";
    }, 1500);
  };

  return (
    <BrowserRouter>
      <div className="App container">
        <div className="flex justify-end p-2"></div>

        {isLoggedIn && (
          <>
            <HeaderComponent handleLogout={handleLogout} />
            <NavbarComponent />
          </>
        )}

        <Routes>
          {!isLoggedIn ? (
            <>
              <Route
                path="/login"
                element={
                  <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-4">
                    <LoginPage setIsLoggedIn={setIsLoggedIn} />
                    <h6>Or</h6>
                    <div className="flex justify-center">
                      <GitHubAuth setIsLoggedIn={setIsLoggedIn} />
                      <GoogleAuth setIsLoggedIn={setIsLoggedIn} />
                    </div>
                  </div>
                }
              />
              <Route
                path="/signup"
                element={
                  <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-4">
                    <SignUpPage onSignUpSuccess={handleSignUpSuccess} />
                    <div className="flex justify-center">
                      <GitHubAuth setIsLoggedIn={setIsLoggedIn} />
                      <GoogleAuth setIsLoggedIn={setIsLoggedIn} />
                    </div>
                  </div>
                }
              />
              <Route
                path="/forgotpassword"
                element={
                  <div>
                    <ForgotPasswordPage setIsLoggedIn={setIsLoggedIn} />
                  </div>
                }
              />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/department" element={<Department />} />
              <Route path="/employee" element={<Employee />} />
              <Route path="/location" element={<Location />} />
              <Route path="/send-bulk" element={<BulkEmailForm />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </>
          )}
        </Routes>

        {showLogoutModal && <LogoutComponent />}

        {showSignUpSuccessModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-top">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Sign Up Successful</h5>
                </div>
                <div className="modal-body text-center">
                  <p>User created successfully!</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
