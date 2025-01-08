import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CampaignForm from "./components/CampaignForm";
import TrackingReports from "./components/TrackingReports";
import CampaignDetails from "./components/CampaignDetails";
import Sidebar from "./components/Sidebar";
import "./styles.css";

const BACKEND_URL = "https://mailer-backend-7ay3.onrender.com";

const App = () => {
  const [user, setUser] = useState(null); // Track user login state
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

  // Check if the user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set user from localStorage
    }
  }, []);

  // Fetch tracking reports when the component mounts
  useEffect(() => {
    fetchTrackingReports();
  }, []);

  return (
    <div className="app-container">
      {/* Conditionally render Sidebar only if user is logged in */}
      {user && <Sidebar user={user} />}

      <div className="main-content">
        <Routes>
          {/* Main Page (CampaignForm) */}
          <Route
            path="/"
            element={
              <CampaignForm
                user={user}
                handleGoogleLogin={handleGoogleLogin}
                trackingReports={trackingReports}
              />
            }
          />

          {/* Tracking Reports Route */}
          <Route
            path="/tracking-reports"
            element={
              user ? (
                <TrackingReports trackingReports={trackingReports} />
              ) : (
                <CampaignForm
                  user={user}
                  handleGoogleLogin={handleGoogleLogin}
                  trackingReports={trackingReports}
                />
              )
            }
          />

          {/* Campaign Details Route */}
          <Route
            path="/campaign-details/:campaignId"
            element={
              user ? (
                <CampaignDetails />
              ) : (
                <CampaignForm
                  user={user}
                  handleGoogleLogin={handleGoogleLogin}
                  trackingReports={trackingReports}
                />
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