const nodemailer = require("nodemailer");
const Agenda = require("agenda");

const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI, collection: "scheduledJobs" },
  lockLifetime: 10000,
});

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

const startAgenda = async () => {
  await agenda.start();
  console.log("Agenda started and ready to process jobs.");
  agenda.processEvery("1 second");
};

module.exports = { agenda, startAgenda };