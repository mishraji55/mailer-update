import config from "../config";

export const fetchTrackingReports = async () => {
  const response = await fetch(`${config.backendUrl}/tracking-reports`); // Use backticks
  const data = await response.json();
  return data.trackingReports || [];
};

export const fetchCampaignDetails = async (campaignId) => {
  const response = await fetch(`${config.backendUrl}/campaign-details/${campaignId}`); // Use backticks
  const data = await response.json();
  return data;
};

export const sendEmail = async (formData) => {
  const response = await fetch(`${config.backendUrl}/send-email`, { // Use backticks
    method: "POST",
    body: formData,
  });
  return await response.json();
};