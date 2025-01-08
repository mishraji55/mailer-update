const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const MongoStore = require("connect-mongo"); // For production session storage
const mongoose = require("mongoose"); // For MongoDB connection
const dotenv = require("dotenv"); // For environment variables
const cors = require("cors"); // For enabling CORS
const multer = require("multer"); // For file uploads
const csvParser = require("csv-parser"); // For parsing CSV files
const fs = require("fs"); // For file system operations
const path = require("path"); // For file paths
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs
const schedule = require("node-schedule"); // For scheduling emails
const nodemailer = require("nodemailer"); // For sending emails
const emailValidator = require("email-validator"); // For validating email addresses

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.MONGODB_URI) {
  console.error("Missing required environment variables. Please check your .env file.");
  process.exit(1); // Exit the application if required variables are missing
}

const app = express();

// Enable CORS
app.use(cors());

// Session setup with MongoDB store (for production)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // Your MongoDB connection string
    }),
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit the application if MongoDB connection fails
  });

// Register Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Ensure this is set
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Ensure this is set
      callbackURL: "https://mailer-backend-7ay3.onrender.com/auth/google/callback", // Ensure this matches
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle user authentication
      console.log("Google profile:", profile);
      done(null, profile);
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google OAuth2 login route
app.get(
  "/auth/google",
  (req, res, next) => {
    passport.authenticate("google", {
      scope: ["profile", "email", "https://www.googleapis.com/auth/gmail.send"],
    })(req, res, next);
  },
  (err, req, res, next) => {
    if (err) {
      console.error("Error in /auth/google:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Google OAuth2 callback route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Redirect to the CampaignForm route after successful login
    res.redirect("https://mailer1-d1qw.onrender.com/campaign");
  }
);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).send("Server is running");
});

// Start the server
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});