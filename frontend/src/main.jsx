import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react'; // Import Auth0Provider
import './index.css';
import App from './App.jsx';

// Replace these with your Auth0 domain and client ID
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={domain} // Your Auth0 domain
      clientId={clientId} // Your Auth0 client ID
      authorizationParams={{
        redirect_uri: window.location.origin, // Redirect URL after login
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
);