import React from "react";

const CampaignForm = ({ user, handleGoogleLogin, trackingReports }) => {
  return (
    <div className="campaign-form">
      {/* Login button at the top-right corner */}
      <div className="login-button-container">
        {!user ? (
          <button onClick={handleGoogleLogin} className="login-button">
            Login with Google
          </button>
        ) : (
          <p>Welcome, {user.displayName}!</p>
        )}
      </div>

      <h1>Campaign Form</h1>

      {/* Campaign Form */}
      <form>
        <label>Campaign Name:</label>
        <input
          type="text"
          placeholder="Enter campaign name"
          disabled={!user} // Disable if user is not logged in
        />

        <label>Recipient Emails:</label>
        <textarea
          placeholder="Enter recipient emails"
          disabled={!user} // Disable if user is not logged in
        />

        <label>Email Content:</label>
        <textarea
          placeholder="Enter email content"
          disabled={!user} // Disable if user is not logged in
        />

        <button type="submit" disabled={!user}>
          Create Campaign
        </button>
      </form>

      {/* Display tracking reports (if applicable) */}
      {user && (
        <div className="tracking-reports">
          <h2>Tracking Reports</h2>
          <ul>
            {trackingReports.map((report, index) => (
              <li key={index}>{report.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CampaignForm;