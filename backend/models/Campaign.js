const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  subject: String,
  userId: String, // Add userId field to associate campaigns with users
  recipients: [
    {
      email: String,
      status: { type: String, default: "Not Sent" },
      opened: { type: Boolean, default: false },
      linkVisited: { type: Boolean, default: false },
      trackingId: String,
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Add createdAt field for sorting
});

module.exports = mongoose.model("Campaign", campaignSchema);