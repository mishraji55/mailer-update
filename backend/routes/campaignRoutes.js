const express = require("express");
const Campaign = require("../models/Campaign");
const router = express.Router();

// Fetch tracking reports
router.get("/tracking-reports", async (req, res) => {
  try {
    const campaigns = await Campaign.find({});

    const trackingReports = campaigns.map((campaign) => {
      const totalEmailsSent = campaign.recipients.length;
      const totalOpened = campaign.recipients.filter((r) => r.opened).length;
      const totalClicks = campaign.recipients.filter((r) => r.linkVisited).length;

      const ctr = totalEmailsSent > 0 ? ((totalClicks / totalEmailsSent) * 100).toFixed(2) : 0;
      const otr = totalEmailsSent > 0 ? ((totalOpened / totalEmailsSent) * 100).toFixed(2) : 0;

      return {
        _id: campaign._id,
        subject: campaign.subject,
        ctr: parseFloat(ctr),
        otr: parseFloat(otr),
      };
    });

    res.status(200).json({ trackingReports });
  } catch (error) {
    console.error("Error fetching tracking reports:", error);
    res.status(500).send({ message: "An error occurred while fetching tracking reports." });
  }
});

// Fetch campaign details
router.get("/campaign-details/:campaignId", async (req, res) => {
  const campaignId = req.params.campaignId;

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
});

// Handle unsubscribe
router.get("/unsubscribe/:email", (req, res) => {
  const email = decodeURIComponent(req.params.email);
  console.log(`Unsubscribe request received for email: ${email}`);
  res.send(`You have unsubscribed from emails sent to ${email}`);
});

module.exports = router;