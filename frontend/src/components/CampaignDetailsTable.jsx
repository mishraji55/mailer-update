import React from "react";

const CampaignDetailsTable = ({ campaign }) => {
  // Check if campaign or recipients is undefined
  if (!campaign || !campaign.recipients) {
    return <div>No campaign data available.</div>;
  }

  return (
    <div>
      <h2>{campaign.subject}</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Recipient</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Opened</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Link Visited</th>
          </tr>
        </thead>
        <tbody>
          {campaign.recipients.map((recipient) => (
            <tr key={recipient.email}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{recipient.email}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{recipient.status}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{recipient.opened ? "Yes" : "No"}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{recipient.linkVisited ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignDetailsTable;