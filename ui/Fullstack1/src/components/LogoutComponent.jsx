import React from "react";

const LogoutComponent = () => {
  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-top">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Logging Out</h5>
          </div>
          <div className="modal-body text-center">
            <p>You have been logged out successfully.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutComponent;
