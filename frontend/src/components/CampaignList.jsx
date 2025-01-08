import React from "react";

const CampaignList = ({ campaigns, onSelectCampaign }) => {
  return (
    <div>
      <h4>Campaigns</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {campaigns.map((campaign) => (
          <li key={campaign._id} style={{ marginBottom: "10px" }}>
            <button
              onClick={() => onSelectCampaign(campaign)}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              {campaign.subject}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignList; 