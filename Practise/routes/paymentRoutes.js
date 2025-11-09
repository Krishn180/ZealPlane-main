require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/support", async (req, res) => {
  try {
    const options = {
      amount: 50 * 100, // ₹50 in paise
      currency: "INR",
      receipt: `support_${Math.random().toString(36).substring(7)}`,
      notes: {
        purpose: "Support Creator",
        userEmail: req.body.email || "Anonymous",
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order_id: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Error creating support order:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
