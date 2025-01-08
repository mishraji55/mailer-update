import React from "react";

const Sidebar = ({ user, setSelectedCampaign, setShowTrackingReports, handleGoogleLogin }) => (
  <div className="sidebar">
    <h3>Menu</h3>
    <ul>
      {!user && (
        <li>
          <button
            onClick={handleGoogleLogin}
            className="login-button"
          >
            Login with Google
          </button>
        </li>
      )}
      {user && (
        <>
          <li>
            <button
              onClick={() => setShowTrackingReports(false)}
              className="menu-button"
            >
              New Campaign
            </button>
          </li>
          <li>
            <button
              onClick={() => setShowTrackingReports(true)}
              className="menu-button"
            >
              Tracking Reports
            </button>
          </li>
        </>
      )}
    </ul>
  </div>
);

export default Sidebar;