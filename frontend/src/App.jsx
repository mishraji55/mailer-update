import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import CampaignForm from "./components/CampaignForm";
import TrackingReports from "./components/TrackingReports";
import CampaignDetails from "./components/CampaignDetails";
import CampaignList from "./components/CampaignList";
import "./styles.css";


const BACKEND_URL = "https://mailer-backend-7ay3.onrender.com";

const App = () => {
  const [user, setUser] = useState(null);
  const [showTrackingReports, setShowTrackingReports] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [trackingReports, setTrackingReports] = useState([]);

  // Fetch tracking reports
  const fetchTrackingReports = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/tracking-reports`);
      const data = await response.json();
      setTrackingReports(data.trackingReports);
    } catch (error) {
      console.error("Error fetching tracking reports:", error);
    }
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  useEffect(() => {
    fetchTrackingReports();
  }, []);

  return (
    <div className="app-container">
      <Sidebar
        user={user}
        setSelectedCampaign={setSelectedCampaign}
        setShowTrackingReports={setShowTrackingReports}
        handleGoogleLogin={handleGoogleLogin}
      />
      <div className="main-content">
        {!user ? (
          <div className="login-message">
            <p>Please log in to start sending emails.</p>
          </div>
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