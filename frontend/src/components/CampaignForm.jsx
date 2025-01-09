import React from "react";

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
}) => {
  return (
    <div>
      <h1>Email Sender</h1>

      {/* CSV Upload */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="csvUpload" style={{ display: "block", fontWeight: "bold" }}>
          Upload CSV File with Recipients:
        </label>
        <input
          id="csvUpload"
          type="file"
          onChange={(e) => setCsvFile(e.target.files[0])}
          accept=".csv"
          style={{ marginBottom: "10px", padding: "8px" }}
        />
        <small style={{ color: "#555" }}>Please upload a CSV file with email addresses and personalized fields.</small>
      </div>

      {/* Subject */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="subject" style={{ display: "block", fontWeight: "bold" }}>
          Email Subject:
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject"
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
      </div>

      {/* Email Content */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="manualText" style={{ display: "block", fontWeight: "bold" }}>
          Email Content (Text):
        </label>
        <textarea
          id="manualText"
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Enter your email content here"
          rows="5"
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
      </div>

      {/* HTML/Markdown File Upload */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="contentFile" style={{ display: "block", fontWeight: "bold" }}>
          Or Upload HTML/Markdown File:
        </label>
        <input
          id="contentFile"
          type="file"
          onChange={(e) => setContentFile(e.target.files[0])}
          accept=".html,.md"
          style={{ marginBottom: "10px", padding: "8px" }}
        />
      </div>

      {/* Schedule Email Option */}
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
        <label htmlFor="scheduleEmail" style={{ fontWeight: "bold" }}>
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
          <label htmlFor="scheduleDate" style={{ display: "block", fontWeight: "bold" }}>
            Select Date and Time:
          </label>
          <input
            id="scheduleDate"
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={onSendEmail}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Send Email
      </button>

      {/* Status Message */}
      <p style={{ marginTop: "20px", fontSize: "16px", color: "#555" }}>{status}</p>
    </div>
  );
};

export default CampaignForm;