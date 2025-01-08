import React from "react";

const Login = ({ handleGoogleLogin }) => (
  <div className="login-container">
    <h1>Welcome to Email Sender</h1>
    <p>Please log in with Google to access the features.</p>
    <button onClick={handleGoogleLogin} className="login-button">
      Login with Google
    </button>
  </div>
);

export default Login;