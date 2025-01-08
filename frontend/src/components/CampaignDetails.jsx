import React from "react";

const CampaignDetails = ({ campaign }) => {
  return (
    <div>
      <h2>{campaign.subject}</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Recipient</th>
            <th>Status</th>
            <th>Opened</th>
            <th>Link Visited</th>
          </tr>
        </thead>
        <tbody>
          {campaign.recipients.map((recipient) => (
            <tr key={recipient.email}>
              <td>{recipient.email}</td>
              <td>{recipient.status}</td>
              <td>{recipient.opened ? "Yes" : "No"}</td>
              <td>{recipient.linkVisited ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignDetails; 