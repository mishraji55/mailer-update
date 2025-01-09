const Campaign = require("../models/Campaign");
const { agenda } = require("../services/emailService");
const { parseCSV } = require("../services/csvService");
const { replacePersonalizationTags } = require("../utils/tagReplacer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

exports.sendEmail = async (req, res) => {
  const { subject, manualText, isScheduled, sendAt } = req.body;
  const csvFile = req.files.csvFile[0];
  const contentFile = req.files.contentFile ? req.files.contentFile[0] : null;

  try {
    const recipients = await parseCSV(csvFile.path);
    const campaign = await Campaign.create({
      subject,
      recipients: recipients.map((recipient) => ({
        email: recipient.email,
        trackingId: uuidv4(),
      })),
    });

    let emailContent = manualText || "";
    if (contentFile) emailContent = fs.readFileSync(contentFile.path, "utf-8");

    for (const recipient of recipients) {
      const personalizedContent = replacePersonalizationTags(emailContent, recipient);
      const trackingId = campaign.recipients.find((r) => r.email === recipient.email).trackingId;

      const trackingPixel = `<img src="https://mailer-backend-7ay3.onrender.com/track/${trackingId}" width="1" height="1" style="display:none;" />`;
      const trackedLink = `https://mailer-backend-7ay3.onrender.com/click/${trackingId}`;
      const unsubscribeLink = `<p>If you wish to unsubscribe, click <a href="https://mailer-backend-7ay3.onrender.com/unsubscribe/${encodeURIComponent(recipient.email)}">here</a>.</p>`;

      const finalHtml = `${personalizedContent}<p>Click <a href="${trackedLink}">here</a> to visit the link.</p>${trackingPixel}${unsubscribeLink}`;

      if (isScheduled === "true") {
        await agenda.schedule(new Date(sendAt), "send email", {
          recipient: recipient.email,
          subject,
          content: finalHtml,
        });
      } else {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: recipient.email,
          subject,
          html: finalHtml,
        });
      }
    }

    res.status(200).send({ message: "Emails processed successfully!", campaignId: campaign._id });
  } catch (error) {
    res.status(500).send({ message: "Error processing emails." });
  }
};