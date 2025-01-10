import config from "../config";

export const fetchTrackingReports = async (userId) => {
  const response = await fetch(`${config.backendUrl}/tracking-reports?userId=${userId}`);
  const data = await response.json();
  return data.trackingReports || [];
};

export const fetchCampaignDetails = async (campaignId, userId) => {
  const response = await fetch(`${config.backendUrl}/campaign-details/${campaignId}?userId=${userId}`);
  const data = await response.json();
  return data;
};

export const sendEmail = async (formData) => {
  const response = await fetch(`${config.backendUrl}/send-email`, {
    method: "POST",
    body: formData,
  });
  return await response.json();
};