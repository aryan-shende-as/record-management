import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SendSms from "./SendSms"; // Import the separate component
import { variables } from "../Variables";

const ForgotPassword = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("email"); // toggle between "email" and "twilio"

  const navigate = useNavigate();

  const sendEmailOtp = async () => {
    try {
      const response = await axios.post(variables.SEND_EMAIL_OTP, {
        email,
      });
      if (response.status === 200) {
        setMessage("OTP sent to your Email.");
        setStep(2);
      }
    } catch (err) {
      setMessage("Failed to send OTP.", err);
    }
  };

  const verifyEmailOtp = async () => {
    try {
      const response = await axios.post(variables.VERIFY_EMAIL_OTP, {
        email,
        otp,
      });
      if (response.status === 200) {
        setIsLoggedIn(true);
        navigate(variables.HOME_PAGE_URL);
      }
    } catch (err) {
      setMessage("Invalid OTP.", err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "10px" }}>
        {/* Toggle Tabs */}
        <div className="d-flex mb-3">
          <button
            className={`flex-fill btn ${mode === "email" ? "btn-dark" : "btn-light"}`}
            onClick={() => {
              setMode("email");
              setMessage("");
              setStep(1);
              setOtp("");
            }}
          >
            Email OTP
          </button>
          <button
            className={`flex-fill btn ${mode === "twilio" ? "btn-dark" : "btn-light"}`}
            onClick={() => {
              setMode("twilio");
              setMessage("");
            }}
          >
            Twilio OTP
          </button>
        </div>

        {/* Conditional Rendering */}
        {mode === "email" ? (
          <>
            <h4 className="text-center mb-3">Login Using Email</h4>

            {step === 1 && (
              <>
                <input
                  type="email"
                  className="form-control mb-2"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn btn-primary w-100" onClick={sendEmailOtp}>
                  Send OTP
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button className="btn btn-success w-100" onClick={verifyEmailOtp}>
                  Verify OTP
                </button>
              </>
            )}

            {message && <p className="text-center text-danger mt-3">{message}</p>}
          </>
        ) : (
          <SendSms setIsLoggedIn={setIsLoggedIn} />
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
