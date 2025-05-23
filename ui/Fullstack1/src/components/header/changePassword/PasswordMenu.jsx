// components/ProfileMenu.js
import React from "react";

const ProfileMenu = ({ onPhotoClick, onPasswordClick, onLogout }) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={onPhotoClick}
      >
        Change Photo
      </button>
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={onPasswordClick}
      >
        Change Password
      </button>
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileMenu;
