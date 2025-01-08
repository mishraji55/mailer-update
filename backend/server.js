const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const emailRoutes = require("./routes/emailRoutes");
const trackingRoutes = require("./routes/trackingRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(authRoutes);
app.use(campaignRoutes);
app.use(emailRoutes);
app.use(trackingRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI).then(() => console.log("Connected to MongoDB"));

// Start Server
const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Server running on port ${port}`));