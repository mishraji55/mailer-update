const Sidebar = ({ user, setSelectedCampaign, setShowTrackingReports, trackingReports }) => (
  <div style={{ width: "200px", backgroundColor: "#f4f4f4", padding: "20px" }}>
    <h3>Menu</h3>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {!user && (
        <li>
          <button onClick={handleGoogleLogin}>Login with Google</button>
        </li>
      )}
      {user && (
        <>
          <li>
            <button onClick={() => setShowTrackingReports(false)}>New Campaign</button>
          </li>
          <li>
            <button onClick={() => setShowTrackingReports(true)}>Tracking Reports</button>
          </li>
        </>
      )}
    </ul>
  </div>
);

export default Sidebar;