const express = require("express");
const Campaign = require("../models/Campaign");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");

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

// Track email open (tracking pixel)
router.get("/track/:trackingId", async (req, res) => {
  const trackingId = req.params.trackingId;
  console.log(`Email opened. Tracking ID: ${trackingId}`);

  try {
    const campaign = await Campaign.findOne({ "recipients.trackingId": trackingId });
    if (campaign) {
      const recipient = campaign.recipients.find((r) => r.trackingId === trackingId);
      if (recipient) {
        recipient.opened = true;
        await campaign.save();
        console.log(`Updated opened status for ${recipient.email}`);
      }
    }

    // Send the 1x1 transparent pixel
    const filePath = path.join(__dirname, "../tracking-pixels.png"); // Correct file name
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error tracking email open:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Handle link click tracking
router.get("/click/:trackingId", async (req, res) => {
  const trackingId = req.params.trackingId;
  console.log(`Link clicked. Tracking ID: ${trackingId}`);

  try {
    const campaign = await Campaign.findOne({ "recipients.trackingId": trackingId });
    if (campaign) {
      const recipient = campaign.recipients.find((r) => r.trackingId === trackingId);
      if (recipient) {
        recipient.linkVisited = true;
        await campaign.save();
        console.log(`Updated link visited status for ${recipient.email}`);
      }
    }
    res.redirect("https://mailer1-d1qw.onrender.com"); // Redirect to your frontend URL
  } catch (error) {
    console.error("Error tracking link click:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Handle unsubscribe
router.get("/unsubscribe/:email", async (req, res) => {
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
        console.log(`Updated status to Unsubscribed for ${recipient.email}`);
      }
    }

    res.send(`You have unsubscribed from emails sent to ${email}`);
  } catch (error) {
    console.error("Error handling unsubscribe:", error);
    res.status(500).send("An error occurred while processing your unsubscribe request.");
  }
});

module.exports = router;