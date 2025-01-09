import React from "react";

const TrackingReportsTable = ({ trackingReports, onCampaignSelect }) => {
  return (
    <div>
      <h2>Tracking Reports</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Subject</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>CTR (%)</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>OTR (%)</th>
          </tr>
        </thead>
        <tbody>
          {trackingReports.map((report) => (
            <tr key={report._id} onClick={() => onCampaignSelect(report._id)}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{report.subject}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{report.ctr}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{report.otr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackingReportsTable;