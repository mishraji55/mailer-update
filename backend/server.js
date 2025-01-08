const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const MongoStore = require("connect-mongo"); // For production session storage
require("dotenv").config();

// Validate environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.MONGODB_URI) {
  console.error("Missing required environment variables. Please check your .env file.");
  process.exit(1); // Exit the application if required variables are missing
}

const app = express();

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
    // Redirect to the frontend after successful login
    res.redirect("https://mailer1-d1qw.onrender.com/dashboard");
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