const asynchandler = require("express-async-handler");
const User = require("../models/userModel");

/* =============================
      GAMIFICATION CONTROLLER
   ============================= */

/**
 * ✅ Add points & log activity
 * - Updates user's total points
 * - Handles daily login streak logic
 * - Pushes an entry into activity log
 * - Manages level progress & leveling up
 */
const addPoints = asynchandler(async (userId, points, activityType, relatedId = null) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Update points
  user.points += points;

  // ✅ Handle daily login streak only if activityType = dailyLogin
  const today = new Date();
  if (activityType === "dailyLogin") {
    if (!user.lastLoginDate || !isSameDay(user.lastLoginDate, today)) {
      if (user.lastLoginDate && isYesterday(user.lastLoginDate, today)) {
        user.dailyLoginStreak += 1; // consecutive login
      } else {
        user.dailyLoginStreak = 1; // reset streak
      }
      user.lastLoginDate = today;
    }
  }

  // Add entry to activity log
  user.activityLog.push({
    type: activityType,
    pointsEarned: points,
    relatedId,
    date: new Date(),
  });

  // ✅ Level up logic
  const LEVEL_THRESHOLD = 100; // points required per level
  user.level.progress += points;
  while (user.level.progress >= LEVEL_THRESHOLD) {
    user.level.current += 1;
    user.level.progress -= LEVEL_THRESHOLD;
  }

  await user.save();
  return user;
});

/**
 * ✅ Helper function: Check if two dates are the same day
 */
function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

/**
 * ✅ Helper function: Check if d1 is exactly one day before d2
 */
function isYesterday(d1, d2) {
  const yesterday = new Date(d2);
  yesterday.setDate(d2.getDate() - 1);
  return isSameDay(d1, yesterday);
}

/**
 * ✅ Add badge to user
 * - Prevents duplicate badges
 * - Saves earnedAt date, optional icon & description
 */
const addBadge = asynchandler(async (userId, badgeName, icon = null, description = null) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Prevent duplicate badges
  const hasBadge = user.badges.some(b => b.name === badgeName);
  if (!hasBadge) {
    user.badges.push({
      name: badgeName,
      earnedAt: new Date(),
      icon,
      description,
    });
    await user.save();
  }

  return user.badges;
});

/**
 * ✅ Get gamification stats for a user
 * - Points
 * - Daily streak
 * - Level info
 * - Badges
 * - Activity log
 */
const getGamificationStats = asynchandler(async (userId) => {
  const user = await User.findOne({ uniqueId: userId });
  if (!user) throw new Error("User not found");

  return {
    points: user.points,
    dailyLoginStreak: user.dailyLoginStreak,
    lastLoginDate: user.lastLoginDate,
    level: user.level,
    badges: user.badges,
    activityLog: user.activityLog,
  };
});



/**
 * ✅ Claim lootbox
 * - Prevents claiming lootbox of same level multiple times
 * - Records claim history
 * - Rewards extra points (default: 50)
 */
const claimLootbox = asynchandler(async (userId, level) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const alreadyClaimed = user.level.lootboxesClaimed.some(lb => lb.level === level);
  if (alreadyClaimed) throw new Error("Lootbox already claimed for this level");

  // Record claim
  user.level.lootboxesClaimed.push({ level, claimedAt: new Date() });
  await user.save();

  // Example reward: +50 points
  await addPoints(userId, 50, `lootbox_level_${level}`);

  return user.level.lootboxesClaimed;
});

module.exports = {
  addPoints,
  addBadge,
  getGamificationStats,
  claimLootbox,
};
