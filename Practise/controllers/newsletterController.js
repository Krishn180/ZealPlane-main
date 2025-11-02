const Newsletter = require("../models/newsletter");

// Subscribe
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(200).json({ message: "Already subscribed!" });
    }

    await Newsletter.create({ email });
    res.status(201).json({ message: "Subscribed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error subscribing user" });
  }
};

// Optional: unsubscribe
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    await Newsletter.findOneAndDelete({ email });
    res.json({ message: "Unsubscribed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error unsubscribing user" });
  }
};
