console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL, // No fallback value
  frontendUrl: import.meta.env.VITE_FRONTEND_URL, // No fallback value
};

export default config;