const Campaign = require("../models/Campaign");
const { agenda } = require("../services/emailService");
const { parseCSV } = require("../services/csvService");
const { replacePersonalizationTags } = require("../utils/tagReplacer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

exports.sendEmail = async (req, res) => {
  console.log("Received request to send email");
  const { subject, manualText, isScheduled, sendAt, userId } = req.body; // Add userId
  const csvFile = req.files.csvFile[0];
  const contentFile = req.files.contentFile ? req.files.contentFile[0] : null;

  console.log("CSV File:", csvFile);
  console.log("Content File:", contentFile);

  try {
    // Parse CSV file
    const recipients = await parseCSV(csvFile.path);
    console.log("Recipients:", recipients);

    // Create a new campaign in MongoDB with userId
    const newCampaign = await Campaign.create({
      subject,
      userId, // Associate campaign with the user
      recipients: recipients.map((recipient) => ({
        email: recipient.email,
        status: "Not Sent",
        opened: false,
        linkVisited: false,
        trackingId: uuidv4(),
      })),
    });
    console.log("New Campaign Created:", newCampaign);

    let emailContent = manualText || "";
    if (contentFile) {
      emailContent = fs.readFileSync(contentFile.path, "utf-8");
    }
    console.log("Email Content:", emailContent);

    // Send or schedule emails for each recipient
    for (const recipient of recipients) {
      const personalizedContent = replacePersonalizationTags(emailContent, recipient);
      const trackingId = newCampaign.recipients.find((r) => r.email === recipient.email).trackingId;

      // Add tracking pixel, tracked link, and unsubscribe link
      const trackingPixel = `<img src="https://mailer-backend-7ay3.onrender.com/track/${trackingId}" width="1" height="1" style="display:none;" />`;
      const trackedLink = `https://mailer-backend-7ay3.onrender.com/click/${trackingId}`;
      const unsubscribeLink = `<p>If you wish to unsubscribe, click <a href="https://mailer-backend-7ay3.onrender.com/unsubscribe/${encodeURIComponent(
        recipient.email
      )}">here</a>.</p>`;

      const finalHtml = `${personalizedContent}<p>Click <a href="${trackedLink}">here</a> to visit the link.</p>${trackingPixel}${unsubscribeLink}`;

      if (isScheduled === "true") {
        // Schedule the email using Agenda
        await agenda.schedule(new Date(sendAt), "send email", {
          recipient: recipient.email,
          subject,
          content: finalHtml,
        });
        console.log(`Email scheduled for ${sendAt}`);
      } else {
        // Send the email immediately
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const result = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: recipient.email,
          subject,
          html: finalHtml,
        });
        console.log(`Email sent successfully to ${recipient.email}`, result);

        // Update recipient status in the campaign
        const recipientData = newCampaign.recipients.find((r) => r.email === recipient.email);
        recipientData.status = "Sent";
        await newCampaign.save();
      }
    }

    // Cleanup uploaded files
    fs.unlinkSync(csvFile.path);
    if (contentFile) fs.unlinkSync(contentFile.path);

    res.status(200).send({ message: "Emails processed successfully!", campaignId: newCampaign._id });
  } catch (error) {
    console.error("Error processing emails:", error);
    res.status(500).send({ message: "Error processing emails." });
  }
};