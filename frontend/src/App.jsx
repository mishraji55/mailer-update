// src/App.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import CampaignForm from "./components/CampaignForm";
import TrackingReports from "./components/TrackingReports";
import CampaignDetails from "./components/CampaignDetails";
import CampaignList from "./components/CampaignList"; 

const App = () => {
  const [user, setUser] = useState(null);
  const [showTrackingReports, setShowTrackingReports] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [trackingReports, setTrackingReports] = useState([]);

  // Fetch tracking reports
  const fetchTrackingReports = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/tracking-reports`);
      const data = await response.json();
      setTrackingReports(data.trackingReports);
    } catch (error) {
      console.error("Error fetching tracking reports:", error);
    }
  };

  useEffect(() => {
    fetchTrackingReports();
  }, []);

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
          <TrackingReports trackingReports={trackingReports} />
        ) : selectedCampaign ? (
          <CampaignDetails campaign={selectedCampaign} />
        ) : (
          <>
            <CampaignForm />
            <CampaignList
              campaigns={trackingReports}
              onSelectCampaign={(campaign) => setSelectedCampaign(campaign)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;