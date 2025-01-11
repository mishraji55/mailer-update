const nodemailer = require("nodemailer");
const Agenda = require("agenda");
const Campaign = require("../models/Campaign");

const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI, collection: "scheduledJobs" },
  lockLifetime: 10000,
});

// Job to send emails
agenda.define("send email", async (job) => {
  const { recipient, subject, content } = job.attrs.data;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipient,
      subject,
      text: content,
    });
    console.log(`Email sent to ${recipient}`);
  } catch (error) {
    console.error(`Error sending email to ${recipient}:`, error);
  }
});

// Job to delete old campaigns based on data retention policy
agenda.define("delete old campaigns", async (job) => {
  const retentionPeriod = parseInt(process.env.DATA_RETENTION_DAYS) || 30; // Default to 30 days
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionPeriod);

  try {
    // Delete campaigns older than the retention period
    await Campaign.deleteMany({ createdAt: { $lt: cutoffDate } });
    console.log(`Deleted campaigns older than ${retentionPeriod} days.`);
  } catch (error) {
    console.error("Error deleting old campaigns:", error);
  }
});

const startAgenda = async () => {
  await agenda.start();
  console.log("Agenda started and ready to process jobs.");
  agenda.processEvery("1 second");

  // Schedule the job to run daily at midnight
  await agenda.every("0 0 * * *", "delete old campaigns"); // Cron syntax for daily at midnight
  console.log("Scheduled job to delete old campaigns.");
};

module.exports = { agenda, startAgenda };