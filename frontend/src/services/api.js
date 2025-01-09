export const fetchTrackingReports = async () => {
  const response = await fetch("https://mailer-backend-7ay3.onrender.com/tracking-reports");
  const data = await response.json();
  return data.trackingReports || [];
};

export const fetchCampaignDetails = async (campaignId) => {
  const response = await fetch(`https://mailer-backend-7ay3.onrender.com/campaign-details/${campaignId}`);
  const data = await response.json();
  return data;
};

export const sendEmail = async (formData) => {
  const response = await fetch("https://mailer-backend-7ay3.onrender.com/send-email", {
    method: "POST",
    body: formData,
  });
  return await response.json();
};