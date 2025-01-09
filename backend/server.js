const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { startAgenda } = require("./services/emailService");
const emailRoutes = require("./routes/emailRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Start Agenda
startAgenda();

// Routes
app.use("/", emailRoutes);
app.use("/", campaignRoutes);

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});