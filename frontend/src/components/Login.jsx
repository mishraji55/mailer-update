const Login = ({ handleGoogleLogin }) => (
  <div>
    <h1>Welcome to Email Sender</h1>
    <p>Please log in with Google to start sending emails.</p>
    <button onClick={handleGoogleLogin}>Login with Google</button>
  </div>
);

export default Login;