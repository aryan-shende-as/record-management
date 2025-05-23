import axios from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";

export const login = async (username, password) => {
  try {
    const response = await axios.post("/auth/login", { username, password });

    localStorage.setItem("token", response.data.token);

    // console.log(localStorage.getItem('token'));

    return response;
  } catch (error) {
    console.error("Login error:", error);
  }
};

export const logout = async () => {
  await axios.post("/auth/logout");
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getRoleFromToken = () => {
  const token = getToken();
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.role;
};

export function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token role:", decoded.role);
    return decoded.role;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data; // e.g., "Password changed successfully."
  } catch (error) {
    throw error.response?.data || 'Password change failed.';
  }
};
