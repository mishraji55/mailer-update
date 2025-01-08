import React, { useState } from "react";

// Hardcoded backend URL
const BACKEND_URL = "https://mailer-backend-7ay3.onrender.com";

const CampaignForm = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [contentFile, setContentFile] = useState(null);
  const [manualText, setManualText] = useState("");
  const [subject, setSubject] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [status, setStatus] = useState("");

  const handleSendEmail = async () => {
    const formData = new FormData();
    formData.append("csvFile", csvFile);
    formData.append("contentFile", contentFile);
    formData.append("manualText", manualText);
    formData.append("subject", subject);
    formData.append("isScheduled", isScheduled);
    if (isScheduled) formData.append("sendAt", scheduleDate);

    try {
      const response = await fetch(`${BACKEND_URL}/send-email`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(data.message || "Emails sent successfully!");
      } else {
        setStatus(data.message || "Error sending email");
      }
    } catch (error) {
      setStatus("An error occurred while sending the email.");
    }
  };

  return (
    <div className="campaign-form">
      <h1>Email Sender</h1>
      <div className="form-group">
        <label htmlFor="csvUpload">Upload CSV File with Recipients:</label>
        <input
          id="csvUpload"
          type="file"
          onChange={(e) => setCsvFile(e.target.files[0])}
          accept=".csv"
        />
      </div>
      <div className="form-group">
        <label htmlFor="subject">Email Subject:</label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject"
        />
      </div>
      <div className="form-group">
        <label htmlFor="manualText">Email Content (Text):</label>
        <textarea
          id="manualText"
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Enter your email content here"
          rows="5"
        />
      </div>
      <div className="form-group">
        <label htmlFor="contentFile">Or Upload HTML/Markdown File:</label>
        <input
          id="contentFile"
          type="file"
          onChange={(e) => setContentFile(e.target.files[0])}
          accept=".html,.md"
        />
      </div>
      <div className="form-group">
        <label htmlFor="scheduleEmail">Schedule Email:</label>
        <input
          id="scheduleEmail"
          type="checkbox"
          checked={isScheduled}
          onChange={() => setIsScheduled(!isScheduled)}
        />
      </div>
      {isScheduled && (
        <div className="form-group">
          <label htmlFor="scheduleDate">Select Date and Time:</label>
          <input
            id="scheduleDate"
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          />
        </div>
      )}
      <button onClick={handleSendEmail} className="send-button">
        Send Email
      </button>
      <p className="status-message">{status}</p>
    </div>
  );
};

export default CampaignForm;