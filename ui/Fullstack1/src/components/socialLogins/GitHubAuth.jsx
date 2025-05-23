import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Custom GitHub Button
const CustomGithubButton = ({ clientId }) => {
  const handleGitHubLogin = () => {
    const redirectUri = 'http://localhost:3000/github-callback'; // Replace with your actual redirect URI

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;

    // Redirect to GitHub for login
    window.location.href = githubAuthUrl;
  };

  return (
    <button onClick={handleGitHubLogin}>
      <img
        style={{ maxHeight: '26px' }}
        src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
        alt="GitHub"
      />
    </button>
  );
};

const GitHubAuth = ({ setIsLoggedIn }) => {
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

  const handleLoginSuccess = (response) => {
    console.log("Login Success:", response);
    setIsLoggedIn(true);
    setUser(response);
    navigate("/home");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <CustomGithubButton
        clientId="Ov23li3Be79Kh0klICI9"
        onSuccess={handleLoginSuccess}
        onError={() => console.log("GitHub Login Failed")}
      />
    </div>
  );
};

export default GitHubAuth;


