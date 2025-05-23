import React, { useRef, useEffect } from "react";

const PasswordModal = ({
  existingPassword,
  newPassword,
  setExistingPassword,
  setNewPassword,
  handlePasswordChange,
  setShowPasswordModal,
  passwordMessage,
  passwordError,
}) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowPasswordModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white rounded shadow-lg w-full max-w-md p-6 relative border"
        ref={modalRef}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
          <button
            onClick={() => setShowPasswordModal(false)}
            className="text-gray-600 hover:text-black text-lg"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Existing Password"
            className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
            value={existingPassword}
            onChange={(e) => setExistingPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {passwordMessage && (
          <p className="text-green-600 text-sm text-center mb-2">{passwordMessage}</p>
        )}
        {passwordError && (
          <p className="text-red-600 text-sm text-center mb-2">{passwordError}</p>
        )}

        <div className="flex justify-center">
          <button
            onClick={handlePasswordChange}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
