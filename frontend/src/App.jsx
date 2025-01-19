import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Sidebar from "./components/Sidebar";
import CampaignForm from "./components/CampaignForm";
import TrackingReportsTable from "./components/TrackingReportsTable";
import CampaignDetailsTable from "./components/CampaignDetailsTable";
import { fetchTrackingReports, fetchCampaignDetails, sendEmail } from "./services/api";
import { FaSun, FaMoon } from "react-icons/fa";

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
  const [isDarkMode, setIsDarkMode] = useState(false); 

  const returnToUrl = import.meta.env.VITE_RETURN_TO_URL || window.location.origin;

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

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const reports = await fetchTrackingReports(user.sub);
          setTrackingReports(reports);

          if (selectedCampaign) {
            const campaignDetails = await fetchCampaignDetails(selectedCampaign._id, user.sub);
            setSelectedCampaign(campaignDetails);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const interval = setInterval(fetchData, 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, selectedCampaign, user]);

  const handleSendEmail = async () => {
    const formData = new FormData();
    formData.append("csvFile", csvFile);
    if (contentFile) formData.append("contentFile", contentFile);
    formData.append("manualText", manualText);
    formData.append("subject", subject);
    formData.append("isScheduled", isScheduled);
    if (isScheduled) formData.append("sendAt", scheduleDate);
    formData.append("userId", user.sub);

    try {
      const result = await sendEmail(formData);
      setStatus(result.message || "Emails sent successfully!");
      if (result.campaignId) {
        const campaignDetails = await fetchCampaignDetails(result.campaignId, user.sub);
        setSelectedCampaign(campaignDetails);
        setTrackingReports((prev) => [...prev, campaignDetails]);
      }
    } catch (error) {
      setStatus("Error sending email.");
    }
  };

  const handleCampaignSelect = async (campaignId) => {
    try {
      const campaignDetails = await fetchCampaignDetails(campaignId, user.sub);
      setSelectedCampaign(campaignDetails);
      setShowTrackingReports(false);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      setSelectedCampaign(null);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", backgroundColor: isDarkMode ? "#333" : "#f4f4f4" }}>
      {isAuthenticated && (
        <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: "10px" }}>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              padding: "10px",
              backgroundColor: isDarkMode ? "#555" : "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>

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
            isDarkMode={isDarkMode}
          />
          <div style={{ flex: 1, padding: "20px" }}>
            {showTrackingReports ? (
              <TrackingReportsTable trackingReports={trackingReports} onCampaignSelect={handleCampaignSelect} isDarkMode={isDarkMode} />
            ) : selectedCampaign ? (
              <CampaignDetailsTable campaign={selectedCampaign} isDarkMode={isDarkMode} />
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
                isDarkMode={isDarkMode} 
              />
            )}
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
            backgroundImage: "url('/background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          />

          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              padding: "40px",
              textAlign: "center",
              maxWidth: "400px",
              width: "100%",
              zIndex: 1,
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <img
              src="/collage.png"
              alt="Login"
              style={{
                width: "380px",
                height: "120px",
                borderRadius: "10px",
                marginBottom: "30px",
                filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
              }}
            />

            <h2
              style={{
                marginBottom: "30px",
                color: "#fff",
                fontSize: "24px",
                fontWeight: "600",
                letterSpacing: "0.5px",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              Welcome to the Mass Mail Sender
            </h2>

            <button
              onClick={() => loginWithRedirect()}
              style={{
                padding: "12px 30px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                letterSpacing: "0.5px",
                transition: "background-color 0.3s ease, transform 0.2s ease",
                boxShadow: "0 4px 12px rgba(33, 150, 243, 0.4)",
                ":hover": {
                  backgroundColor: "#1e88e5",
                  transform: "scale(1.05)",
                },
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