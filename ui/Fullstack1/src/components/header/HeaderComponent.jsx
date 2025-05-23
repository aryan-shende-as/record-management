import React, { useState, useRef, useEffect } from "react";
import GoogleTranslateBar from "../../GoogleTranslateBar";
import defaultProfile from "../../assets/default.jpg";
import { changePassword } from "../../auth/authService";
import ProfileMenu from "./changePassword/PasswordMenu";
import PasswordModal from "./changePassword/PasswordModal";

const HeaderComponent = ({ handleLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(defaultProfile);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [existingPassword, setExistingPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const menuRef = useRef();
  const fileInputRef = useRef();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        setMenuOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerPhotoUpload = () => fileInputRef.current.click();

  const handlePasswordChange = async () => {
    setPasswordMessage("");
    setPasswordError("");
    try {
      await changePassword(existingPassword, newPassword);
      setPasswordMessage("Password changed successfully!");
      setExistingPassword("");
      setNewPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordMessage("");
      }, 2000);
    } catch (err) {
      setPasswordError(err?.message || "Password change failed.");
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm py-4 px-6 mb-6 flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800">Record Management</h1>

        <div className="flex items-center gap-x-4 relative">
          <GoogleTranslateBar />

          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="w-10 h-10 rounded-full p-0.5 focus:outline-none"
            >
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </button>

            {menuOpen && (
              <ProfileMenu
                onPhotoClick={triggerPhotoUpload}
                onPasswordClick={() => {
                  setShowPasswordModal(true);
                  setMenuOpen(false);
                }}
                onLogout={handleLogout}
              />
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </header>

      {showPasswordModal && (
        <PasswordModal
          existingPassword={existingPassword}
          newPassword={newPassword}
          setExistingPassword={setExistingPassword}
          setNewPassword={setNewPassword}
          handlePasswordChange={handlePasswordChange}
          setShowPasswordModal={setShowPasswordModal}
          passwordMessage={passwordMessage}
          passwordError={passwordError}
        />
      )}
    </>
  );
};

export default HeaderComponent;
