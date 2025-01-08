const Campaign = require("../models/Campaign");

exports.trackEmailOpen = async (req, res) => {
  const trackingId = req.params.trackingId;

  const campaign = await Campaign.findOne({ "recipients.trackingId": trackingId });
  if (campaign) {
    const recipient = campaign.recipients.find((r) => r.trackingId === trackingId);
    if (recipient) {
      recipient.opened = true;
      await campaign.save();
    }
  }

  res.sendFile(path.join(__dirname, "tracking-pixels.png"));
};