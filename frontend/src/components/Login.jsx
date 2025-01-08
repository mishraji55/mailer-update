import React from "react";


const BACKEND_URL = "https://mailer-backend-7ay3.onrender.com";

const Login = () => (
  <div className="login-container">
    <h1>Welcome to Email Sender</h1>
    <p>Please log in with Google to start sending emails.</p>
    <button
      onClick={() => (window.location.href = `${BACKEND_URL}/auth/google`)}
      className="login-button"
    >
      Login with Google
    </button>
  </div>
);

export default Login;