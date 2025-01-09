import React from "react";

const Sidebar = ({ onNewCampaign, onShowTrackingReports, trackingReports, onCampaignSelect }) => {
  return (
    <div style={{ width: "200px", backgroundColor: "#f4f4f4", padding: "20px", minHeight: "100vh" }}>
      <h3>Menu</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "10px" }}>
          <button
            onClick={onNewCampaign}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              cursor: "pointer",
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
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              cursor: "pointer",
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
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
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