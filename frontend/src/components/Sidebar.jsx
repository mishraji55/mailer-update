import React from "react";
import './ButtonStyles.css';
const Sidebar = ({ onNewCampaign, onShowTrackingReports, trackingReports, onCampaignSelect }) => {
  return (
    <div style={{ width: "200px", backgroundColor: "#f4f4f4", padding: "20px", minHeight: "100vh" }}>
      <h3>Menu</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "10px" }}>
          <button
            onClick={onNewCampaign}
            className="bounce-effect"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#2196F3", // Changed to blue
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            New Campaign
          </button>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <button
            onClick={onShowTrackingReports}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#2196F3", // Changed to blue
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Tracking Reports
          </button>
        </li>
      </ul>

      {/* List of Campaigns */}
      {trackingReports.length > 0 && (
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
                    backgroundColor: "#2196F3", // Changed to blue
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