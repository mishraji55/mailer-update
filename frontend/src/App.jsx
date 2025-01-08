import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import CampaignForm from "./components/CampaignForm";
import TrackingReports from "./components/TrackingReports";
import CampaignDetails from "./components/CampaignDetails";
import CampaignList from "./components/CampaignList";
import Login from "./components/Login";
import "./styles.css";

const BACKEND_URL = "https://mailer-backend-7ay3.onrender.com";

const App = () => {
  const [user, setUser] = useState(null);
  const [showTrackingReports, setShowTrackingReports] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [trackingReports, setTrackingReports] = useState([]);
  const navigate = useNavigate();

  const fetchTrackingReports = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/tracking-reports`);
      const data = await response.json();
      setTrackingReports(data.trackingReports);
    } catch (error) {
      console.error("Error fetching tracking reports:", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/campaign");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchTrackingReports();
  }, []);

  return (
    <div className="app-container">
      {user && <Sidebar
        user={user}
        setSelectedCampaign={setSelectedCampaign}
        setShowTrackingReports={setShowTrackingReports}
        handleGoogleLogin={handleGoogleLogin}
      />}
      <div className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              !user ? (
                <Login handleGoogleLogin={handleGoogleLogin} />
              ) : (
                <CampaignForm />
              )
            }
          />
          <Route
            path="/campaign"
            element={
              user ? (
                <>
                  <CampaignForm />
                  <CampaignList
                    campaigns={trackingReports}
                    onSelectCampaign={(campaign) => setSelectedCampaign(campaign)}
                  />
                </>
              ) : (
                <Login handleGoogleLogin={handleGoogleLogin} />
              )
            }
          />
          <Route
            path="/tracking-reports"
            element={
              user ? (
                <TrackingReports trackingReports={trackingReports} />
              ) : (
                <Login handleGoogleLogin={handleGoogleLogin} />
              )
            }
          />
          <Route
            path="/campaign-details/:campaignId"
            element={
              user ? (
                <CampaignDetails campaign={selectedCampaign} />
              ) : (
                <Login handleGoogleLogin={handleGoogleLogin} />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;