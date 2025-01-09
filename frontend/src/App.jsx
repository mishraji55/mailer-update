import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import CampaignForm from "./components/CampaignForm";
import TrackingReportsTable from "./components/TrackingReportsTable";
import CampaignDetailsTable from "./components/CampaignDetailsTable";
import { fetchTrackingReports, fetchCampaignDetails, sendEmail } from "./services/api";

const App = () => {
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

  // Fetch tracking reports and campaign details periodically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const reports = await fetchTrackingReports();
        setTrackingReports(reports);

        if (selectedCampaign) {
          const campaignDetails = await fetchCampaignDetails(selectedCampaign._id);
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
  }, [selectedCampaign]);

  // Handle sending emails
  const handleSendEmail = async () => {
    const formData = new FormData();
    formData.append("csvFile", csvFile);
    if (contentFile) formData.append("contentFile", contentFile);
    formData.append("manualText", manualText);
    formData.append("subject", subject);
    formData.append("isScheduled", isScheduled);
    if (isScheduled) formData.append("sendAt", scheduleDate);

    try {
      const result = await sendEmail(formData);
      setStatus(result.message || "Emails sent successfully!");
      if (result.campaignId) {
        const campaignDetails = await fetchCampaignDetails(result.campaignId);
        setSelectedCampaign(campaignDetails);
        setTrackingReports((prev) => [...prev, campaignDetails]); // Add new campaign to the list
      }
    } catch (error) {
      setStatus("Error sending email.");
    }
  };

  // Handle campaign selection
  const handleCampaignSelect = async (campaignId) => {
    const campaignDetails = await fetchCampaignDetails(campaignId);
    setSelectedCampaign(campaignDetails);
    setShowTrackingReports(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
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

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#f9f9f9" }}>
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
    </div>
  );
};

export default App;