const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");
const emailValidator = require("email-validator");
const { v4: uuidv4 } = require("uuid");
const schedule = require("node-schedule");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const app = express();
const cors = require("cors");
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(cors());

// Debugging: Log the MongoDB connection string
console.log("MONGODB_URI:", process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit the application if MongoDB connection fails
  });

// Define Campaign Schema
const campaignSchema = new mongoose.Schema({
  subject: String,
  recipients: [{
    email: String,
    status: { type: String, default: "Not Sent" },
    opened: { type: Boolean, default: false },
    linkVisited: { type: Boolean, default: false },
    trackingId: String,
  }],
});

const Campaign = mongoose.model("Campaign", campaignSchema);

// Set up transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to replace tags with recipient data
const replacePersonalizationTags = (content, recipientData) => {
  let personalizedContent = content;
  Object.keys(recipientData).forEach((key) => {
    const tag = `{{${key}}}`;
    personalizedContent = personalizedContent.replace(new RegExp(tag, "g"), recipientData[key]);
  });
  return personalizedContent;
};

// Handle sending emails
app.post("/send-email", upload.fields([{ name: "csvFile" }, { name: "contentFile" }]), async (req, res) => {
  const { subject, manualText, isScheduled, sendAt } = req.body;

  if (!req.files || !req.files.csvFile) {
    return res.status(400).send({ message: "CSV file with recipient details is required." });
  }

  const csvFile = req.files.csvFile[0];
  const contentFile = req.files.contentFile ? req.files.contentFile[0] : null;

  if (!subject) {
    return res.status(400).send({ message: "Subject is required." });
  }

  if (!manualText && !contentFile) {
    return res.status(400).send({ message: "Provide email content via text input or file upload." });
  }

  if (manualText && contentFile) {
    return res.status(400).send({ message: "Use only one content option: text or file upload." });
  }

  // Parse CSV file
  const recipients = [];
  const filePath = path.join(__dirname, csvFile.path);

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (data) => {
      if (emailValidator.validate(data.email)) {
        recipients.push(data);
      }
    })
    .on("end", async () => {
      const uniqueRecipients = Array.from(new Set(recipients));
      const campaignId = uuidv4();

      // Create a new campaign in MongoDB
      const newCampaign = new Campaign({
        subject,
        recipients: uniqueRecipients.map((recipient) => ({
          email: recipient.email,
          trackingId: uuidv4(),
        })),
      });

      await newCampaign.save();

      let emailContent = manualText || "";

      if (contentFile) {
        emailContent = fs.readFileSync(path.join(__dirname, contentFile.path), "utf-8");
      }

      for (const recipient of uniqueRecipients) {
        const personalizedContent = replacePersonalizationTags(emailContent, recipient);
        const recipientData = newCampaign.recipients.find((r) => r.email === recipient.email);
        const trackingId = recipientData.trackingId;

        const trackingPixel = `<img src="https://mailer-backend-7ay3.onrender.com/track/${trackingId}" width="1" height="1" style="display:none;" />`;
        const trackedLink = `https://mailer-backend-7ay3.onrender.com/click/${trackingId}`;
        const unsubscribeLink = `<p>If you wish to unsubscribe, click <a href="https://mailer-backend-7ay3.onrender.com/unsubscribe/${encodeURIComponent(
          recipient.email
        )}">here</a>.</p>`;

        const finalHtml = `${personalizedContent}<p>Click <a href="${trackedLink}">here</a> to visit the link.</p>${trackingPixel}${unsubscribeLink}`;

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: recipient.email,
          subject,
          text: personalizedContent, // Plain text fallback
          html: finalHtml,
        };

        if (isScheduled === "true") {
          const scheduleDate = new Date(sendAt);
          schedule.scheduleJob(scheduleDate, async () => {
            try {
              const result = await transporter.sendMail(mailOptions);
              console.log(`Scheduled email sent successfully to ${recipient.email}`, result);
              recipientData.status = "Sent";
              await newCampaign.save();
            } catch (error) {
              console.error(`Error sending scheduled email to ${recipient.email}:`, error.message);
            }
          });
        } else {
          try {
            const result = await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to ${recipient.email}`, result);
            recipientData.status = "Sent";
            await newCampaign.save();
          } catch (error) {
            console.error(`Error sending email to ${recipient.email}:`, error.message);
          }
        }
      }

      // Cleanup uploaded files
      fs.unlinkSync(filePath);
      if (contentFile) fs.unlinkSync(path.join(__dirname, contentFile.path));

      res.status(200).send({ message: "Emails processed successfully!", campaignId: newCampaign._id });
    })
    .on("error", (err) => {
      console.error("Error processing CSV file:", err);
      res.status(500).send({ message: "Error processing CSV file." });
    });
});

// Track email open (tracking pixel)
app.get("/track/:trackingId", async (req, res) => {
  const trackingId = req.params.trackingId;
  console.log(`Email opened. Tracking ID: ${trackingId}`);

  // Update recipient's opened status in MongoDB
  const campaign = await Campaign.findOne({ "recipients.trackingId": trackingId });
  if (campaign) {
    const recipient = campaign.recipients.find((r) => r.trackingId === trackingId);
    if (recipient) {
      recipient.opened = true;
      await campaign.save();
    }
  }

  res.sendFile(path.join(__dirname, "tracking-pixels.png"));
});

// Handle click tracking
app.get("/click/:trackingId", async (req, res) => {
  const trackingId = req.params.trackingId;
  console.log(`Link clicked. Tracking ID: ${trackingId}`);

  // Update recipient's linkVisited status in MongoDB
  const campaign = await Campaign.findOne({ "recipients.trackingId": trackingId });
  if (campaign) {
    const recipient = campaign.recipients.find((r) => r.trackingId === trackingId);
    if (recipient) {
      recipient.linkVisited = true;
      await campaign.save();
    }
  }

  res.redirect("https://mailer1-d1qw.onrender.com");
});

// Fetch tracking reports
app.get("/tracking-reports", async (req, res) => {
  const trackingReports = await Campaign.find({}, { subject: 1, _id: 1 });
  res.status(200).json({ trackingReports });
});

// Fetch campaign details
app.get("/campaign-details/:campaignId", async (req, res) => {
  const campaignId = req.params.campaignId;

  // Validate campaignId
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
app.get("/unsubscribe/:email", (req, res) => {
  const email = decodeURIComponent(req.params.email);
  console.log(`Unsubscribe request received for email: ${email}`);
  res.send(`You have unsubscribed from emails sent to ${email}`);
});

// Start the server
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});