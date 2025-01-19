import React, { useState } from "react";
import './ButtonStyles.css';
import { FaBars, FaEnvelope, FaChartLine } from "react-icons/fa";

const Sidebar = ({ onNewCampaign, onShowTrackingReports, trackingReports, onCampaignSelect, isDarkMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      style={{
        width: isCollapsed ? "60px" : "200px",
        backgroundColor: isDarkMode ? "#2d2d2d" : "#f4f4f4", // Slightly darker background for sidebar in dark mode
        padding: "20px",
        minHeight: "100vh",
        transition: "width 0.3s ease",
        borderRight: `1px solid ${isDarkMode ? "#444" : "#ddd"}`, // Smooth modern border
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={toggleSidebar}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            color: isDarkMode ? "#fff" : "#333", // Adjust icon color for dark mode
          }}
        >
          <FaBars />
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "10px" }}>
          <button
            onClick={onNewCampaign}
            className="bounce-effect"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: isDarkMode ? "#2196F3" : "#2196F3", // Keep button color consistent
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              fontSize: isCollapsed ? "20px" : "16px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "flex-start",
            }}
          >
            {isCollapsed ? <FaEnvelope /> : "New Campaign"}
          </button>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <button
            onClick={onShowTrackingReports}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: isDarkMode ? "#2196F3" : "#2196F3", // Keep button color consistent
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              fontSize: isCollapsed ? "20px" : "16px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "flex-start",
            }}
          >
            {isCollapsed ? <FaChartLine /> : "Tracking Reports"}
          </button>
        </li>
      </ul>

      {!isCollapsed && trackingReports.length > 0 && (
        <>
          <h4 style={{ color: isDarkMode ? "#fff" : "#333" }}>Campaigns</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {trackingReports.map((report) => (
              <li key={report._id} style={{ marginBottom: "10px" }}>
                <button
                  onClick={() => onCampaignSelect(report._id)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: isDarkMode ? "#2196F3" : "#2196F3", // Keep button color consistent
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  {report.subject}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Sidebar;