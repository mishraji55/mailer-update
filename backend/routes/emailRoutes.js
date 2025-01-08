const express = require("express");
const emailController = require("../controllers/emailController");
const isAuthenticated = require("../middleware/isAuthenticated"); // Import the middleware

const router = express.Router();

// Protect routes with isAuthenticated middleware
router.post("/send-email", isAuthenticated, emailController.sendEmail);

module.exports = router;