const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: String,
  recipients: [
    {
      email: String,
      status: { type: String, default: "Not Sent" },
      opened: { type: Boolean, default: false },
      linkVisited: { type: Boolean, default: false },
      trackingId: String,
    },
  ],
});

module.exports = mongoose.model("Campaign", campaignSchema);