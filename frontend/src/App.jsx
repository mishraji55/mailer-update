import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import CampaignForm from "./components/CampaignForm";
import TrackingReports from "./components/TrackingReports";
import CampaignDetails from "./components/CampaignDetails";

const App = () => {
  const [user, setUser] = useState(null);
  const [showTrackingReports, setShowTrackingReports] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        user={user}
        setSelectedCampaign={setSelectedCampaign}
        setShowTrackingReports={setShowTrackingReports}
      />
      <div style={{ flex: 1, padding: "20px" }}>
        {!user ? (
          <Login handleGoogleLogin={() => window.location.href = `${process.env.BACKEND_URL}/auth/google`} />
        ) : showTrackingReports ? (
          <TrackingReports />
        ) : selectedCampaign ? (
          <CampaignDetails campaign={selectedCampaign} />
        ) : (
          <CampaignForm />
        )}
      </div>
    </div>
  );
};

export default App;