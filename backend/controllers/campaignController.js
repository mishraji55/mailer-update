const Campaign = require("../models/Campaign");

exports.getCampaignDetails = async (req, res) => {
  const campaignId = req.params.campaignId;

  if (!mongoose.Types.ObjectId.isValid(campaignId)) {
    return res.status(400).send({ message: "Invalid campaign ID." });
  }

  try {
    const campaign = await Campaign.findOne({ _id: campaignId, userId: req.user._id });
    if (!campaign) {
      return res.status(404).send({ message: "Campaign not found." });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).send({ message: "An error occurred while fetching campaign details." });
  }
};