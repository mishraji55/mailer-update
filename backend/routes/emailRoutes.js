const express = require("express");
const { sendEmail } = require("../controllers/emailController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const config = require("../config");

const router = express.Router();

router.post("/send-email", upload.fields([{ name: "csvFile" }, { name: "contentFile" }]), sendEmail);

module.exports = router;