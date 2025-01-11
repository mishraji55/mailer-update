import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Sidebar from "./components/Sidebar";
import CampaignForm from "./components/CampaignForm";
import TrackingReportsTable from "./components/TrackingReportsTable";
import CampaignDetailsTable from "./components/CampaignDetailsTable";
import { fetchTrackingReports, fetchCampaignDetails, sendEmail } from "./services/api";

const App = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [csvFile, setCsvFile] = useState(null);
  const [contentFile, setContentFile] = useState(null);
  const [manualText, setManualText] = useState("");
  const [subject, setSubject] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [status, setStatus] = useState("");
  const [trackingReports, setTrackingReports] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showTrackingReports, setShowTrackingReports] = useState(false);

  // Dynamically set the returnTo URL based on the environment
  const returnToUrl = import.meta.env.VITE_RETURN_TO_URL || window.location.origin;

  // Reset all state when the user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setCsvFile(null);
      setContentFile(null);
      setManualText("");
      setSubject("");
      setIsScheduled(false);
      setScheduleDate("");
      setStatus("");
      setTrackingReports([]);
      setSelectedCampaign(null);
      setShowTrackingReports(false);
    }
  }, [isAuthenticated]);

  // Fetch tracking reports and campaign details periodically
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const reports = await fetchTrackingReports(user.sub); // Pass user ID
          setTrackingReports(reports);

          if (selectedCampaign) {
            const campaignDetails = await fetchCampaignDetails(selectedCampaign._id, user.sub); // Pass user ID
            setSelectedCampaign(campaignDetails);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      // Fetch data every 1 second
      const interval = setInterval(fetchData, 1000);

      // Cleanup interval on unmount
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, selectedCampaign, user]);

  // Handle sending emails
  const handleSendEmail = async () => {
    const formData = new FormData();
    formData.append("csvFile", csvFile);
    if (contentFile) formData.append("contentFile", contentFile);
    formData.append("manualText", manualText);
    formData.append("subject", subject);
    formData.append("isScheduled", isScheduled);
    if (isScheduled) formData.append("sendAt", scheduleDate);
    formData.append("userId", user.sub); // Add user ID to the request

    try {
      const result = await sendEmail(formData);
      setStatus(result.message || "Emails sent successfully!");
      if (result.campaignId) {
        const campaignDetails = await fetchCampaignDetails(result.campaignId, user.sub);
        setSelectedCampaign(campaignDetails);
        setTrackingReports((prev) => [...prev, campaignDetails]); // Add new campaign to the list
      }
    } catch (error) {
      setStatus("Error sending email.");
    }
  };

  // Handle campaign selection
  const handleCampaignSelect = async (campaignId) => {
    try {
      const campaignDetails = await fetchCampaignDetails(campaignId, user.sub); // Pass user ID
      setSelectedCampaign(campaignDetails);
      setShowTrackingReports(false);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      setSelectedCampaign(null); // Reset selected campaign if there's an error
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      {/* Logout Button (Top Right Corner) */}
      {isAuthenticated && (
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <button
            onClick={() => logout({ returnTo: returnToUrl })}
            style={{
              padding: "10px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      {isAuthenticated ? (
        <>
          <Sidebar
            onNewCampaign={() => {
              setSelectedCampaign(null);
              setShowTrackingReports(false);
              setCsvFile(null);
              setContentFile(null);
              setManualText("");
              setSubject("");
              setIsScheduled(false);
              setScheduleDate("");
              setStatus("");
            }}
            onShowTrackingReports={() => setShowTrackingReports(true)}
            trackingReports={trackingReports}
            onCampaignSelect={handleCampaignSelect}
          />
          <div style={{ flex: 1, padding: "20px" }}>
            {showTrackingReports ? (
              <TrackingReportsTable trackingReports={trackingReports} onCampaignSelect={handleCampaignSelect} />
            ) : selectedCampaign ? (
              <CampaignDetailsTable campaign={selectedCampaign} />
            ) : (
              <CampaignForm
                csvFile={csvFile}
                setCsvFile={setCsvFile}
                contentFile={contentFile}
                setContentFile={setContentFile}
                manualText={manualText}
                setManualText={setManualText}
                subject={subject}
                setSubject={setSubject}
                isScheduled={isScheduled}
                setIsScheduled={setIsScheduled}
                scheduleDate={scheduleDate}
                setScheduleDate={setScheduleDate}
                onSendEmail={handleSendEmail}
                status={status}
              />
            )}
          </div>
        </>
      ) : (
        // Centered Login Card
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "20px",
              textAlign: "center",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            {/* Logo */}
            <img
              src="/collage.png" 
              alt="Login"
              style={{ 
                width: "100%", // Cover the entire width of the card
                height: "auto", // Maintain aspect ratio
                borderRadius: "10px", // Optional: Add rounded corners
                marginBottom: "20px", // Add spacing below the image
              }}
            />

            {/* Login Message */}
            <h2 style={{ marginBottom: "20px", color: "#333" }}>Welcome to the Mass Mail Sender</h2>

            {/* Login Button */}
            <button
              onClick={() => loginWithRedirect()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;