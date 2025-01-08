const express = require("express");
const trackingController = require("../controllers/trackingController");

const router = express.Router();

router.get("/track/:trackingId", trackingController.trackEmailOpen);

module.exports = router;