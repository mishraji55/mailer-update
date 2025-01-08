import React from "react";

const CampaignForm = ({ user, handleGoogleLogin, trackingReports }) => {
  return (
    <div className="campaign-form">
      <h1>Campaign Form</h1>

      {/* Show login button if user is not logged in */}
      {!user && (
        <div className="login-prompt">
          <p>Please log in to access the features.</p>
          <button onClick={handleGoogleLogin} className="login-button">
            Login with Google
          </button>
        </div>
      )}

      {/* Show features if user is logged in */}
      {user && (
        <>
          <form>
            <label>Campaign Name:</label>
            <input type="text" placeholder="Enter campaign name" />

            <label>Recipient Emails:</label>
            <textarea placeholder="Enter recipient emails" />

            <label>Email Content:</label>
            <textarea placeholder="Enter email content" />

            <button type="submit">Create Campaign</button>
          </form>

          {/* Display tracking reports (if applicable) */}
          <div className="tracking-reports">
            <h2>Tracking Reports</h2>
            <ul>
              {trackingReports.map((report, index) => (
                <li key={index}>{report.name}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default CampaignForm;