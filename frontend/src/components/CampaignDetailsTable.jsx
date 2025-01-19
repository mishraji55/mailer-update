import React from "react";

const CampaignDetailsTable = ({ campaign, isDarkMode }) => {
  // Check if campaign or recipients is undefined
  if (!campaign || !campaign.recipients) {
    return <div>No campaign data available.</div>;
  }

  return (
    <div style={{ color: isDarkMode ? "#fff" : "#000" }}>
      <h2>{campaign.subject}</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: isDarkMode ? "#444" : "#fff" }}>
        <thead>
          <tr>
            <th style={{ border: `1px solid ${isDarkMode ? "#666" : "#000"}`, padding: "8px", backgroundColor: isDarkMode ? "#555" : "#f4f4f4" }}>Recipient</th>
            <th style={{ border: `1px solid ${isDarkMode ? "#666" : "#000"}`, padding: "8px", backgroundColor: isDarkMode ? "#555" : "#f4f4f4" }}>Status</th>
            <th style={{ border: `1px solid ${isDarkMode ? "#666" : "#000"}`, padding: "8px", backgroundColor: isDarkMode ? "#555" : "#f4f4f4" }}>Opened</th>
            <th style={{ border: `1px solid ${isDarkMode ? "#666" : "#000"}`, padding: "8px", backgroundColor: isDarkMode ? "#555" : "#f4f4f4" }}>Link Visited</th>
          </tr>
        </thead>
        <tbody>
          {campaign.recipients.map((recipient) => (
            <tr key={recipient.email} style={{ backgroundColor: isDarkMode ? "#333" : "#fff" }}>
              <td style={{ border: `1px solid ${isDarkMode ? "#666" : "#000"}`, padding: "8px" }}>{recipient.email}</td>
              <td style={{ border: `1px solid ${isDarkMode ? "#666" : "#000"}`, padding: "8px" }}>{recipient.status}</td>
              <td style={{ border: `1px solid ${isDarkMode ? "#666" : "#000"}`, padding: "8px" }}>{recipient.opened ? "Yes" : "No"}</td>
              <td style={{ border: `1px solid ${isDarkMode ? "#666" : "#000"}`, padding: "8px" }}>{recipient.linkVisited ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignDetailsTable;