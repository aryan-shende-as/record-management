// App.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { variables } from "../Variables";

function SendSms({setIsLoggedIn}) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      const response = await axios.post(variables.TWILIO_OTP_SEND, {
        phoneNumber: phone,
      });
      
      if (response.status === 200) {
        setMessage("OTP sent to your Number.");
        setStep(2);
      }
    } catch (err) {
      setMessage("Failed to send OTP.", err);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post(variables.TWILIO_OTP_VERIFY, {
        phoneNumber: phone,
        otp,
      });
      if (response.status === 200) {
        console.log(otp);
        setIsLoggedIn(true);
        navigate(variables.HOME_PAGE_URL);
      }
    } catch (err) {
      setMessage("Invalid OTP.", err);
    }
  };

  return (
    <>
      <h4 className="text-center mb-3">Login Using Phone No.</h4>

      <input
        className="form-control mb-2"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {step === 1 ? (
        <button className="btn btn-primary w-100" onClick={sendOtp}>
          Send OTP
        </button>
      ) : (
        <>
          <input
            className="border p-2 w-full mt-2"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            className="btn btn-success w-100"
            onClick={verifyOtp}
          >
            Verify OTP
          </button>
        </>
      )}
      {message && <p className="mt-4">{message}</p>}
    </>
  );
}

export default SendSms;
