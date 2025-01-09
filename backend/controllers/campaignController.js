const Campaign = require("../models/Campaign");
const mongoose = require("mongoose");

// Fetch tracking reports
exports.getTrackingReports = async (req, res) => {
  try {
    const campaigns = await Campaign.find({});

    // Calculate CTR and OTR for each campaign
    const trackingReports = campaigns.map((campaign) => {
      const totalEmailsSent = campaign.recipients.length;
      const totalOpened = campaign.recipients.filter((r) => r.opened).length;
      const totalClicks = campaign.recipients.filter((r) => r.linkVisited).length;

      const ctr = totalEmailsSent > 0 ? ((totalClicks / totalEmailsSent) * 100).toFixed(2) : 0;
      const otr = totalEmailsSent > 0 ? ((totalOpened / totalEmailsSent) * 100).toFixed(2) : 0;

      return {
        _id: campaign._id,
        subject: campaign.subject,
        ctr: parseFloat(ctr), // Convert string to number
        otr: parseFloat(otr), // Convert string to number
      };
    });

    res.status(200).json({ trackingReports });
  } catch (error) {
    console.error("Error fetching tracking reports:", error);
    res.status(500).send({ message: "An error occurred while fetching tracking reports." });
  }
};

// Fetch campaign details
exports.getCampaignDetails = async (req, res) => {
  const campaignId = req.params.campaignId;

  // Validate campaignId
  if (!mongoose.Types.ObjectId.isValid(campaignId)) {
    return res.status(400).send({ message: "Invalid campaign ID." });
  }

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).send({ message: "Campaign not found." });
    }
    res.status(200).json(campaign);
  } catch (error) {
    console.error("Error fetching campaign details:", error);
    res.status(500).send({ message: "An error occurred while fetching campaign details." });
  }
};

// Handle unsubscribe
exports.handleUnsubscribe = async (req, res) => {
  const email = decodeURIComponent(req.params.email);
  console.log(`Unsubscribe request received for email: ${email}`);

  try {
    // Find all campaigns where the email exists in recipients
    const campaigns = await Campaign.find({ "recipients.email": email });

    // Update the status of the recipient to "Unsubscribed"
    for (const campaign of campaigns) {
      const recipient = campaign.recipients.find((r) => r.email === email);
      if (recipient) {
        recipient.status = "Unsubscribed";
        await campaign.save();
      }
    }

    res.send(`You have unsubscribed from emails sent to ${email}`);
  } catch (error) {
    console.error("Error handling unsubscribe:", error);
    res.status(500).send("An error occurred while processing your unsubscribe request.");
  }
};