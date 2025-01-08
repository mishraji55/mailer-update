import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom"; // Add React Router
import Sidebar from "./components/Sidebar"; // Ensure this import path is correct
import CampaignForm from "./components/CampaignForm";
import TrackingReports from "./components/TrackingReports";
import CampaignDetails from "./components/CampaignDetails";
import CampaignList from "./components/CampaignList";
import Login from "./components/Login"; // Import Login component
import "./styles.css";

const BACKEND_URL = "https://mailer-backend-7ay3.onrender.com";

const App = () => {
  const [user, setUser] = useState(null);
  const [showTrackingReports, setShowTrackingReports] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [trackingReports, setTrackingReports] = useState([]);
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation

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

  // Check if the user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set user from localStorage
    }
  }, []);

  // Redirect to /campaign after login
  useEffect(() => {
    if (user) {
      navigate("/campaign"); // Redirect to /campaign after login
    }
  }, [user, navigate]);

  // Fetch tracking reports when the component mounts
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
        <Routes>
          {/* Login Route */}
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

          {/* Campaign Route */}
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

          {/* Tracking Reports Route */}
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

          {/* Campaign Details Route */}
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

// Wrap the App component with Router
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;