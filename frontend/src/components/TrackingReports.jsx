import React, { useEffect, useState } from "react";

// Hardcoded backend URL
const BACKEND_URL = "https://mailer-backend-7ay3.onrender.com";

const TrackingReports = () => {
  const [trackingReports, setTrackingReports] = useState([]);

  const fetchTrackingReports = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/tracking-reports`);
      const data = await response.json();
      setTrackingReports(data.trackingReports);
    } catch (error) {
      console.error("Error fetching tracking reports:", error);
    }
  };

  useEffect(() => {
    fetchTrackingReports();
  }, []);

  return (
    <div className="tracking-reports">
      <h2>Tracking Reports</h2>
      <table>
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