import React from "react";

const TrackingReports = ({ trackingReports }) => {
  return (
    <div>
      <h2>Tracking Reports</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Subject</th>
            <th>CTR (%)</th>
            <th>OTR (%)</th>
          </tr>
        </thead>
        <tbody>
          {trackingReports.map((report) => (
            <tr key={report._id}>
              <td>{report.subject}</td>
              <td>{report.ctr}</td>
              <td>{report.otr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackingReports; 