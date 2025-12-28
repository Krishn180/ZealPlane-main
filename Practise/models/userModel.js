const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    /////////////////////////////////////////
    // 🔹 User Basic Details
    /////////////////////////////////////////
    username: {
      type: String,
      required: [true, "Please add the user!"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please add the email address!"],
      unique: [true, "Email address already exists"],
    },
    fullName: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    dob: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    profilePic: {
      type: String,
      default: null,
    },
    Background: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    contactNumber: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    jobRole: {
      type: String,
      default: null,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },

    /////////////////////////////////////////
    // 🔹 Authentication / Security
    /////////////////////////////////////////
    password: {
      type: String,
      required: function () {
        // Make password required only if googleId is not present
        return !this.googleId;
      },
      default: "",
    },
    uniqueId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
    },
    refreshToken: { type: String },
    googleId: {
      type: String,
      default: null,
      unique: true,
    },
    googleToken: {
      type: String,
      default: null,
    },

    /////////////////////////////////////////
    // 🔹 Social / Networking
    /////////////////////////////////////////
    following: [
      {
        uniqueId: { type: String },
        username: { type: String },
        profilePic: { type: String },
      },
    ],
    followers: [
      {
        uniqueId: { type: String },
        username: { type: String },
        profilePic: { type: String },
      },
    ],

    /////////////////////////////////////////
    // 🔹 User Activity Stats
    /////////////////////////////////////////
    totalLikes: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },

    /////////////////////////////////////////
    // 🔹 Gamification / Points System
    /////////////////////////////////////////
    points: { type: Number, default: 0 },
    dailyLoginStreak: { type: Number, default: 0 },
    lastLoginDate: { type: Date, default: null },
    activityLog: [
      {
        type: { type: String, required: true },
        pointsEarned: { type: Number, required: true },
        relatedId: { type: String, default: null },
        date: { type: Date, default: Date.now },
      },
    ],
    level: {
      current: { type: Number, default: 0 },
      progress: { type: Number, default: 0 },
    },
    badges: [
      {
        name: { type: String },
        earnedAt: { type: Date, default: Date.now },
        icon: { type: String, default: null },
        description: { type: String, default: null },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create a unique index on the 'username' field
userSchema.index({ username: 1 }, { unique: true });

// Custom validation: require password if googleId is not present
userSchema.pre("validate", function (next) {
  if (!this.googleId && !this.password) {
    this.invalidate(
      "password",
      "Password is required unless logging in with Google"
    );
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
