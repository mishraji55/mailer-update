const express = require("express");
const campaignController = require("../controllers/campaignController");
const isAuthenticated = require("../middleware/isAuthenticated"); // Import the middleware

const router = express.Router();

// Protect routes with isAuthenticated middleware
router.get("/campaign-details/:campaignId", isAuthenticated, campaignController.getCampaignDetails);

module.exports = router;