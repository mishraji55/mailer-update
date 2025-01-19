import React from "react";

const TrackingReportsTable = ({ trackingReports, onCampaignSelect, isDarkMode }) => {
  return (
    <div style={{ color: isDarkMode ? "#fff" : "#000" }}>
      <h2>Tracking Reports</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: isDarkMode ? "#444" : "#fff" }}>
        <thead>
          <tr>
            <th style={{ border: `1px solid ${isDarkMode ? "#666" : "#ddd"}`, padding: "8px", backgroundColor: isDarkMode ? "#555" : "#f4f4f4" }}>Subject</th>
            <th style={{ border: `1px solid ${isDarkMode ? "#666" : "#ddd"}`, padding: "8px", backgroundColor: isDarkMode ? "#555" : "#f4f4f4" }}>CTR (%)</th>
            <th style={{ border: `1px solid ${isDarkMode ? "#666" : "#ddd"}`, padding: "8px", backgroundColor: isDarkMode ? "#555" : "#f4f4f4" }}>OTR (%)</th>
          </tr>
        </thead>
        <tbody>
          {trackingReports.map((report) => (
            <tr
              key={report._id}
              onClick={() => onCampaignSelect(report._id)}
              style={{ backgroundColor: isDarkMode ? "#333" : "#fff", cursor: "pointer" }}
            >
              <td style={{ border: `1px solid ${isDarkMode ? "#666" : "#ddd"}`, padding: "8px" }}>{report.subject}</td>
              <td style={{ border: `1px solid ${isDarkMode ? "#666" : "#ddd"}`, padding: "8px" }}>{report.ctr}</td>
              <td style={{ border: `1px solid ${isDarkMode ? "#666" : "#ddd"}`, padding: "8px" }}>{report.otr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackingReportsTable;