const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  googleLoginUser,
  getUserByUsername, // New controller function for Google login
  toggleFollow,
  getFollowers,
  getFollowing,
  refreshAccessToken,
  sendOtpForReset,
  verifyOtpAndResetPassword
} = require("./controllers/userController");
const upload = require("./midleware/upload"); // Import the configured multer instance
const ValidateToken = require("./midleware/validateTokenHandler");

const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Google Login route
router.post("/google-login", googleLoginUser); // New route for Google login

// Get current user route
router.get("/me", ValidateToken, currentUser);

// Get user by ID
router.get(
  "/:id",
  (req, res, next) => {
    if (req.headers.authorization) {
      // If the token is present, apply the ValidateToken middleware
      ValidateToken(req, res, next);
    } else {
      // If no token is provided, skip the ValidateToken and proceed directly to getUserById
      next();
    }
  },
  getUserById
);

// Update user (with profilePic upload)
// Ensure token is validated before handling file upload
router.put("/:id", upload.single("profilePic"), ValidateToken, updateUser);

// Delete user
router.delete("/:id", ValidateToken, deleteUser);

// Get user by username (useful for search functionality)
router.get("/username/:username", ValidateToken, getUserByUsername);

router.post("/toggle-follow", toggleFollow);
router.get("/:id/following", getFollowing);
router.get("/:id/followers", getFollowers);
router.post("/refreshtoken", refreshAccessToken);
console.log("refresh:", refreshAccessToken);
router.post("/send-otp", sendOtpForReset);      // ✅ Send OTP to user (e.g., via email or phone)
router.post("/verify-otp", verifyOtpAndResetPassword);

module.exports = router;
