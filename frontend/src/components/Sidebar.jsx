import React, { useState } from "react";
import './ButtonStyles.css';


import { FaBars, FaEnvelope, FaChartLine } from "react-icons/fa"; 

const Sidebar = ({ onNewCampaign, onShowTrackingReports, trackingReports, onCampaignSelect }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); 

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      style={{
        width: isCollapsed ? "60px" : "200px", 
        backgroundColor: "#f4f4f4",
        padding: "20px",
        minHeight: "100vh",
        transition: "width 0.3s ease", 
      }}
    >
      {/* Collapse/Expand Button */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={toggleSidebar}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          <FaBars /> {/* Icon for the toggle button */}
        </button>
      </div>

      {/* Menu Items */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "10px" }}>
          <button
            onClick={onNewCampaign}
            className="bounce-effect"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#2196F3",
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
            {isCollapsed ? <FaEnvelope /> : "New Campaign"} {/* Show icon when collapsed */}
          </button>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <button
            onClick={onShowTrackingReports}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              fontSize: isCollapsed ? "20px" : "16px", // Larger icon size when collapsed
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "flex-start", // Center icon when collapsed
            }}
          >
            {isCollapsed ? <FaChartLine /> : "Tracking Reports"} {/* Show icon when collapsed */}
          </button>
        </li>
      </ul>

      {/* List of Campaigns */}
      {!isCollapsed && trackingReports.length > 0 && ( // Only show campaigns when expanded
        <>
          <h4>Campaigns</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {trackingReports.map((report) => (
              <li key={report._id} style={{ marginBottom: "10px" }}>
                <button
                  onClick={() => onCampaignSelect(report._id)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#2196F3",
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