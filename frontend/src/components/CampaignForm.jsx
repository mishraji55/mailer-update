import React, { useState } from "react";
import './ButtonStyles.css';
import { FaPaperPlane, FaFileUpload, FaCheckCircle, FaExclamationCircle, FaSpinner } from "react-icons/fa";

const CampaignForm = ({
  csvFile,
  setCsvFile,
  contentFile,
  setContentFile,
  manualText,
  setManualText,
  subject,
  setSubject,
  isScheduled,
  setIsScheduled,
  scheduleDate,
  setScheduleDate,
  onSendEmail,
  status,
  isDarkMode,
}) => {
  const [hasConsent, setHasConsent] = useState(false); // State for GDPR consent
  const [isLoading, setIsLoading] = useState(false); // State for loading

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      await onSendEmail();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: isDarkMode ? "#444" : "#fff",
        color: isDarkMode ? "#fff" : "#333",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", color: isDarkMode ? "#fff" : "#333", marginBottom: "20px" }}>Email Sender</h1>

      {/* CSV Upload */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="csvUpload" style={{ display: "block", fontWeight: "bold", marginBottom: "5px", color: isDarkMode ? "#fff" : "#555" }}>
          <FaFileUpload style={{ marginRight: "10px" }} />
          Upload CSV File with Recipients:
        </label>
        <input
          id="csvUpload"
          type="file"
          onChange={(e) => setCsvFile(e.target.files[0])}
          accept=".csv"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            backgroundColor: isDarkMode ? "#555" : "#fff",
            color: isDarkMode ? "#fff" : "#333",
          }}
        />
        <small style={{ color: isDarkMode ? "#ccc" : "#555" }}>Please upload a CSV file with email addresses and personalized fields.</small>
      </div>

      {/* Subject */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="subject" style={{ display: "block", fontWeight: "bold", marginBottom: "5px", color: isDarkMode ? "#fff" : "#555" }}>
          Email Subject:
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            backgroundColor: isDarkMode ? "#555" : "#fff",
            color: isDarkMode ? "#fff" : "#333",
          }}
        />
      </div>

      {/* Email Content */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="manualText" style={{ display: "block", fontWeight: "bold", marginBottom: "5px", color: isDarkMode ? "#fff" : "#555" }}>
          Email Content (Text):
        </label>
        <textarea
          id="manualText"
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Enter your email content here"
          rows="5"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            backgroundColor: isDarkMode ? "#555" : "#fff",
            color: isDarkMode ? "#fff" : "#333",
          }}
        />
      </div>

      {/* HTML/Markdown File Upload */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="contentFile" style={{ display: "block", fontWeight: "bold", marginBottom: "5px", color: isDarkMode ? "#fff" : "#555" }}>
          Or Upload HTML/Markdown File:
        </label>
        <input
          id="contentFile"
          type="file"
          onChange={(e) => setContentFile(e.target.files[0])}
          accept=".html,.md"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            backgroundColor: isDarkMode ? "#555" : "#fff",
            color: isDarkMode ? "#fff" : "#333",
          }}
        />
      </div>

      {/* Schedule Email Option */}
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
        <label htmlFor="scheduleEmail" style={{ fontWeight: "bold", color: isDarkMode ? "#fff" : "#555" }}>
          Schedule Email:
        </label>
        <input
          id="scheduleEmail"
          type="checkbox"
          checked={isScheduled}
          onChange={() => setIsScheduled(!isScheduled)}
          style={{ marginLeft: "10px" }}
        />
      </div>

      {/* Date and Time Picker for Scheduled Emails */}
      {isScheduled && (
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="scheduleDate" style={{ display: "block", fontWeight: "bold", marginBottom: "5px", color: isDarkMode ? "#fff" : "#555" }}>
            Select Date and Time:
          </label>
          <input
            id="scheduleDate"
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              backgroundColor: isDarkMode ? "#555" : "#fff",
              color: isDarkMode ? "#fff" : "#333",
            }}
          />
        </div>
      )}

      {/* GDPR Consent Checkbox */}
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
        <label htmlFor="gdprConsent" style={{ fontWeight: "bold", color: isDarkMode ? "#fff" : "#555" }}>
          I confirm that I have obtained explicit consent from all recipients to send them emails.
        </label>
        <input
          id="gdprConsent"
          type="checkbox"
          checked={hasConsent}
          onChange={(e) => setHasConsent(e.target.checked)}
          style={{ marginLeft: "10px" }}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSendEmail}
        className="bounce-effect"
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: hasConsent ? "#2196F3" : "#ccc",
          color: "white",
          border: "none",
          cursor: hasConsent ? "pointer" : "not-allowed",
          borderRadius: "5px",
          fontSize: "16px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          transition: "background-color 0.3s ease",
        }}
        disabled={!hasConsent || isLoading}
      >
        {isLoading ? <FaSpinner className="spin" /> : <FaPaperPlane />}
        Send Email
      </button>

      {/* Status Message */}
      {status && (
        <div style={{
          marginTop: "20px",
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: status.includes("success") ? "#e8f5e9" : "#ffebee",
          color: status.includes("success") ? "#2e7d32" : "#c62828",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          {status.includes("success") ? <FaCheckCircle /> : <FaExclamationCircle />}
          {status}
        </div>
      )}
    </div>
  );
};

export default CampaignForm;