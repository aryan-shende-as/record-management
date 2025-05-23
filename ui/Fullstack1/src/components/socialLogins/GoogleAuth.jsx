import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const CustomGoogleButton = (props) => {
  console.log('in the custom google login button');
  const login = useGoogleLogin({
    onSuccess: props.onSuccess,
    onError: () => console.log('Login Failed'),
  });

  return (
    <button onClick={() => login()}>
      <img style={{maxHeight:'25px'}} src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
    </button>
  );
};

const GoogleAuth = ({ setIsLoggedIn }) => {

  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  // Save user data in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Handle login success
  const handleLoginSuccess = (response) => {
    console.log("Login Success:", response);
    setIsLoggedIn(true);
    setUser(response);
    navigate("/home"); // Redirect to home page
  };

  // Handle logout
  const handleLogout = () => {
    googleLogout();
    setUser(null);
    navigate("/"); // Redirect to login page
  };

  return (
    <GoogleOAuthProvider clientId="354905575324-uub2h9uojtbc64dav1f5m2v3n1cqgeeq.apps.googleusercontent.com">
      <div className="flex flex-col items-center p-6">
        {!user ? (
          <CustomGoogleButton
            onSuccess={handleLoginSuccess}
            onError={() => console.log("Login Failed")}
          />
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;



