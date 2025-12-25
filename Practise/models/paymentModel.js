const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userUniqueId: {
      type: String,
      required: true,
      ref: "User", // reference to user
    },
    email: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true, // Razorpay gives unique order IDs
    },
    paymentId: {
      type: String,
      default: null, // will come after success
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    purpose: {
      type: String,
      default: "Support Creator",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
