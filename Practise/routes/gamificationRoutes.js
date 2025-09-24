const express = require("express");
const router = express.Router();
const ValidateToken = require("../midleware/validateTokenHandler");
const {
  addPoints,
  addBadge,
  getGamificationStats,
  claimLootbox,
} = require("../controllers/gamificationController");

// 🛡 Middleware: verifyToken => ensures only logged-in users can access routes

// ✅ Add points to user profile
// Body: { points, activityType, relatedId }
// Example: user gets points for posting/commenting/etc.
router.post("/points", ValidateToken, async (req, res) => {
  try {
    const { points, activityType, relatedId } = req.body;
    const user = await addPoints(req.user.id, points, activityType, relatedId);
    res.status(200).json({ message: "Points updated!", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add a badge to user profile
// Body: { badgeName, icon, description }
// Example: "Top Contributor", "Bug Hunter", etc.
router.post("/badges", ValidateToken, async (req, res) => {
  try {
    const { badgeName, icon, description } = req.body;
    const badges = await addBadge(req.user.id, badgeName, icon, description);
    res.status(200).json({ message: "Badge added!", badges });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get user's gamification stats
// Returns: { totalPoints, level, badges, lootboxes }
// Example: frontend dashboard will show these stats
router.get("/stats", ValidateToken, async (req, res) => {
  try {
    const stats = await getGamificationStats(req.user.id);
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Claim a lootbox based on level
// Param: /lootbox/:level
// Example: /lootbox/5 => claim lootbox for level 5
router.post("/lootbox/:level", ValidateToken, async (req, res) => {
  try {
    const { level } = req.params;
    const lootboxes = await claimLootbox(req.user.id, parseInt(level, 10));
    res.status(200).json({ message: "Lootbox claimed!", lootboxes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
