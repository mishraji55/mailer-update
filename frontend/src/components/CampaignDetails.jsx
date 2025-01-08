import React, { useEffect, useState } from "react";

// Hardcoded backend URL
const BACKEND_URL = "https://mailer-backend-7ay3.onrender.com";

const CampaignDetails = ({ campaignId }) => {
  const [campaign, setCampaign] = useState(null);

  const fetchCampaignDetails = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/campaign-details/${campaignId}`);
      const data = await response.json();
      setCampaign(data);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
    }
  };

  useEffect(() => {
    fetchCampaignDetails();
  }, [campaignId]);

  if (!campaign) return <div>Loading...</div>;

  return (
    <div className="campaign-details">
      <h2>{campaign.subject}</h2>
      <table>
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