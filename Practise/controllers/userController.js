const asynchandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { get } = require("../contactsRoutes");
// const mongoose = require("mongoose");
const mongoose = require("mongoose");


// Temporary storage for OTPs
const otpStore = new Map();

const sendOtpEmail = async (email, otp) => {
  console.log("Starting sendOtpEmail function...");

  try {
    console.log("Setting up transporter...");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password (not Gmail password!)
      },
    });

    console.log("Transporter created successfully.");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Registration",
      text: `Dear User,  

Thank you for registering with ZealPlane!  

Your One-Time Password (OTP) for account verification is: ${otp}.  
Please enter this code within the next 10 minutes to complete your registration.  

If you did not request this, please ignore this message.  

Best regards,  
The ZealPlane Team`,
    };

    console.log("Mail options set:");
    console.log(mailOptions);

    console.log("Sending email...");
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log(`OTP sent to: ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

const registerUser = asynchandler(async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      otp,
      fullName,
      description,
      dob,
      gender,
      profilePic,
      location,
      contactNumber,
      address,
      jobRole,
      level,
      googleId, 
    } = req.body;

    // Step 2: Check if the username or email already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      res.status(400);
      throw new Error("Username already taken!");
    }

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User with this email already registered!");
    }

    // Step 3: OTP Verification
    if (!otp) {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000);
      otpStore.set(email, generatedOtp);

      await sendOtpEmail(email, generatedOtp);

      return res.status(200).json({ message: "OTP sent to email!" });
    } else {
      const storedOtp = otpStore.get(email);

      if (!storedOtp || parseInt(otp) !== storedOtp) {
        res.status(400);
        throw new Error("Invalid or expired OTP!");
      }

      otpStore.delete(email);
    }

    // Step 4: Hash the password
    let hashedPassword = null;
    if (!googleId) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Step 5: Generate unique ID and status
    const uniqueId = uuidv4();
    const status = `Active-${uniqueId}`;

    // Step 6: If googleId is not provided, generate a dummy googleId
    const generatedGoogleId = googleId || uuidv4();

    // 🎯 Step 7: Assign registration points
    const REGISTRATION_POINTS = 100; // You can change this value anytime

    // Step 8: Create a new user in the database
    const user = await User.create({
      username,
      email,
      password: googleId ? undefined : hashedPassword,
      googleId: generatedGoogleId,
      uniqueId,
      status,
      fullName: fullName || null,
      description: description || null,
      dob: dob || null,
      gender: gender || null,
      profilePic: profilePic || null,
      location: location || null,
      contactNumber: contactNumber || null,
      address: address || null,
      jobRole: jobRole || null,
      level: level || null,
      points: REGISTRATION_POINTS, // ✅ Add initial points
    });

    // Step 9: Send success response
    if (user) {
      res.status(201).json({
        _id: user.id,
        email: user.email,
        uniqueId: user.uniqueId,
        status: user.status,
        points: user.points, // return points too
      });
    } else {
      res.status(400);
      throw new Error("User data is not valid");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Google Login
// Google Login
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLoginUser = asynchandler(async (req, res) => {
  const { token } = req.body;

  console.log("Received token from frontend:", token);

  if (!token) {
    res.status(400);
    console.log("Token is required");
    throw new Error("Token is required");
  }

  try {
    // Verify the token using Google OAuth2Client
    console.log("Verifying Google token...");
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Google token payload:", payload);

    // Extract user information from the payload
    const { email, name, picture, sub: googleId } = payload;

    // Get the first name from the user's full name
    const firstName = name.split(" ")[0];
    console.log("Extracted firstName:", firstName);

    // Points constants
    const REGISTRATION_POINTS = 100;
    const LOGIN_POINTS = 10;

    // Check if the user already exists
    let user = await User.findOne({ email });
    console.log("User found in database:", user);

    if (!user) {
      // Use the first name as the base username
      let username = firstName;
      let isUsernameTaken = true;
      let counter = 1;

      // Try creating a new user and handle duplicate username
      while (isUsernameTaken) {
        try {
          user = new User({
            fullName: name,
            email: email,
            profilePic: picture,
            googleId: googleId,
            username: username,
            password: "", // Not required for Google-auth
            uniqueId: uuidv4(),
            status: `Active-${uuidv4()}`,
            points: REGISTRATION_POINTS, // 🎯 Reward points on signup
          });

          await user.save();
          console.log("New user created with points:", user);
          isUsernameTaken = false;
        } catch (err) {
          if (err.code === 11000) {
            console.log("Username is already taken. Trying again...");
            username = `${firstName}_${counter}`;
            counter++;
          } else {
            throw err;
          }
        }
      }
    } else {
      // Existing user: reward login points
      if (!user.fullName) user.fullName = name;
      if (!user.profilePic) user.profilePic = picture;

      user.points = (user.points || 0) + LOGIN_POINTS; // 🎯 Add login reward
      await user.save();
      console.log("User updated with Google info & rewarded points:", user);
    }

    // Generate tokens
    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        uniqueId: user.uniqueId,
        username: user.username,
        profilePic: user.profilePic,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    console.log("Generated access token:", accessToken);

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        id: user.uniqueId,
        points: user.points, // 🎯 Include updated points
        token: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    res.status(500);
    throw new Error("Google sign-in failed");
  }
});

module.exports = { googleLoginUser };


// reefresh token for autologin

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        uniqueId: user.uniqueId,
        username: user.username,
        profilePic: user.profilePic,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      token: newAccessToken,
      userId: user._id,
      username: user.username,
    });
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("Login User Request Body:", req.body);

  // Validate email and password
  if (!email || !password) {
    res.status(400);
    console.log("Missing email or password");
    throw new Error("All fields are mandatory!");
  }

  // Step 1: Check if user exists in the database
  console.log("Searching for user with email:", email);
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    console.log("User not found:", email);
    throw new Error("User not found");
  }
  console.log("User found in database:", user);

  // Step 2: Compare the password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(401);
    console.log("Invalid password for user:", email);
    throw new Error("Invalid email or password");
  }
  console.log("Password matches for user:", email);

  // Step 3: Generate access token
  const accessToken = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      uniqueId: user.uniqueId,
      username: user.username,
      profilePic: user.profilePic,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  console.log("Access token generated successfully for user:", email);

  // Step 4: Generate refresh token
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );
  console.log("Refresh token generated successfully for user:", email);

  // Step 5: Send refresh token as an HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: "Strict",
  });
  console.log("Refresh token set in cookies");

  // Step 6: Send response
  res.status(200).json({
    _id: user._id,
    email: user.email,
    username: user.username,
    fullName: user.fullName,
    profilePic: user.profilePic,
    jobRole: user.jobRole,
    token: accessToken,
    refreshToken: refreshToken,
    id: user.uniqueId,
  });
  console.log("User login successful for:", email);
});


// const loginUser = asynchandler(async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email or password missing" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // JWT creation
//     const accessToken = jwt.sign(
//       { userId: user._id },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: "1h" }
//     );

//     const refreshToken = jwt.sign(
//       { userId: user._id },
//       process.env.REFRESH_TOKEN_SECRET,
//       { expiresIn: "30d" }
//     );

//     return res.json({ ok: true, accessToken, refreshToken });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ message: "Login failed", error: err.message });
//   }
// });



// Helper function: compare only calendar day
function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const sendOtpForReset = asynchandler(async (req, res) => {
  const { email } = req.body;

  console.log(`[sendOtpForReset] Incoming request for email: ${email}`);

  if (!email) {
    console.log("[sendOtpForReset] ❌ Email not provided.");
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.log("[sendOtpForReset] ❌ No user found with this email.");
    return res.status(404).json({ success: false, message: "User not found with this email" });
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000);
  otpStore.set(email, generatedOtp);
  console.log(`[sendOtpForReset] ✅ OTP for ${email}: ${generatedOtp}`);

  const nodemailer = require("nodemailer");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Dear User,\n\nYour OTP is: ${generatedOtp}\n\nValid for 10 minutes.\n\n- ZealPlane Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[sendOtpForReset] 📧 Email sent: ${info.messageId}`);

    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("[sendOtpForReset] ❌ Failed to send email:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP email" });
  }
});



const verifyOtpAndResetPassword = asynchandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  console.log(`[verifyOtp] 🔐 Attempting password reset for ${email} with OTP ${otp}`);

  if (!email || !otp || !newPassword) {
    console.log("[verifyOtp] ❌ Missing required fields.");
    return res.status(400).json({ success: false, message: "Email, OTP, and new password are required" });
  }

  const storedOtp = otpStore.get(email);
  if (!storedOtp) {
    console.log("[verifyOtp] ❌ OTP expired or not generated.");
    return res.status(400).json({ success: false, message: "OTP expired or not generated" });
  }

  if (parseInt(otp) !== storedOtp) {
    console.log("[verifyOtp] ❌ Invalid OTP provided.");
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.log("[verifyOtp] ❌ User not found in database.");
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  otpStore.delete(email);

  console.log(`[verifyOtp] ✅ Password successfully reset for ${email}`);

  res.status(200).json({ success: true, message: "Password reset successful" });
});


const currentUser = asynchandler(async (req, res) => {
  try {
    console.log("Request to get current user:", req.user); // Log the request user

    // Check if req.user is defined and has the _id property
    if (!req.user || !req.user.userId) {
      console.error("User ID is missing from request:", req.user);
      return res.status(401).json({ message: "User not authorized" });
    }
    // Assuming req.user contains the user data
    res.status(200).json(req.user); // Send the user data in the response
  } catch (error) {
    console.error("Unable to retrieve current user:", error);
    res.status(500).json({ message: "Unable to retrieve current user" });
  }
});

const getUserById = asynchandler(async (req, res) => {
  const { id } = req.params; // ID of the user being accessed
  const uniqueIdFromToken = req.user ? req.user.uniqueId : null; // Unique ID from the token, if available

  console.log(`Request to get user by ID: ${id}`);

  // Find user by uniqueId
  const user = await User.findOne({ uniqueId: id });
  console.log("User found by ID:", user);

  if (user) {
    // If no token or no match, status is "visitor"
    const status = uniqueIdFromToken === id ? "admin" : "visitor";

    // Respond with user data and status
    res.status(200).json({
      user,
      status,
    });
  } else {
    res.status(404);
    console.log(`User not found with ID: ${id}`);
    throw new Error("User not found");
  }
});

// Update User
const updateUser = asynchandler(async (req, res) => {
  const { id } = req.params;
  const {
    username,
    email,
    fullName,
    description,
    dob,
    gender,
    location,
    contactNumber,
    address,
    jobRole,
    level,
    status,
  } = req.body;

  console.log(`Request to update user with ID: ${id}`);

  // Find user by unique ID
  const user = await User.findOne({ uniqueId: id });

  if (!user) {
    console.log(`User not found with ID: ${id}`);
    res.status(404);
    throw new Error("User not found");
  }

  user.username = username || user.username;
  user.email = email || user.email;
  user.fullName = fullName || user.fullName;
  user.description = description || user.description;
  user.dob = dob || user.dob;
  user.gender = gender || user.gender;
  user.location = location || user.location;
  user.contactNumber = contactNumber || user.contactNumber;
  user.address = address || user.address;
  user.jobRole = jobRole || user.jobRole;
  user.level = level || user.level;
  user.status = status || user.status;

  // Update profilePic if a new file is uploaded
  if (req.file) {
    user.profilePic = req.file.path;
  }

  const updatedUser = await user.save();
  console.log("User updated:", updatedUser);

  res.status(200).json(updatedUser);
});

// Delete User
const deleteUser = asynchandler(async (req, res) => {
  const { id } = req.params;

  console.log(`Request to delete user with ID: ${id}`);

  const user = await User.findOneAndDelete({ uniqueId: id });
  if (user) {
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    console.log(`User not found with ID: ${id}`);
    throw new Error("User not found");
  }
});

const getUserByUsername = asynchandler(async (req, res) => {
  // Extract username from params or search query
  const username = req.params.username || req.query.search;

  console.log(`Request to get user by username or search query: ${username}`); // Log request

  // Check if username or search query is provided
  if (!username) {
    return res.status(400).json({
      title: "Bad Request",
      message: "Username or search query is required",
    });
  }

  // Find user by username using regex for partial matches
  const users = await User.find({
    username: { $regex: username, $options: "i" },
  }); // 'i' makes the search case-insensitive

  console.log("User(s) found by username:", users); // Log the found user(s)

  if (users.length > 0) {
    res.status(200).json(users); // Respond with user data
  } else {
    console.log(`User not found with username: ${username}`); // Log not found
    res.status(404).json({
      title: "Not found",
      message: "User not found",
    }); // Respond with a structured JSON error message
  }
});
// Send friend request
const toggleFollow = async (req, res) => {
  const { senderId, receiverId } = req.body;

  console.log("Received senderId:", senderId);
  console.log("Received receiverId:", receiverId);

  if (!senderId || !receiverId) {
    return res.status(400).json({ msg: "Missing user ID(s)" });
  }

  if (senderId === receiverId) {
    return res.status(400).json({ msg: "You can't follow yourself" });
  }

  try {
    const user = await User.findOne({ uniqueId: senderId });
    const targetUser = await User.findOne({ uniqueId: receiverId });

    if (!user || !targetUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isFollowing = user.following.some(
      (follow) => follow.uniqueId === receiverId
    );

    if (isFollowing) {
      // Unfollow: Remove the user from both following and followers arrays
      user.following = user.following.filter(
        (follow) => follow.uniqueId !== receiverId
      );
      targetUser.followers = targetUser.followers.filter(
        (follow) => follow.uniqueId !== senderId
      );
    } else {
      // Follow: Add the user to both following and followers arrays
      user.following.push({
        uniqueId: targetUser.uniqueId,
        username: targetUser.username,
        profilePic: targetUser.profilePic,
      });

      targetUser.followers.push({
        uniqueId: user.uniqueId,
        username: user.username,
        profilePic: user.profilePic,
      });
    }

    await user.save();
    await targetUser.save();

    return res.status(200).json({
      msg: `Successfully ${isFollowing ? "unfollowed" : "followed"} user.`,
      user: {
        uniqueId: targetUser.uniqueId,
        username: targetUser.username,
        profilePic: targetUser.profilePic,
      },
    });
  } catch (error) {
    console.error("Error toggling follow:", error);
    return res.status(500).json({ msg: "Server error", error });
  }
};

const getFollowing = async (req, res) => {
  try {
    const user = await User.findOne({ uniqueId: req.params.userId });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Directly return the following data from the array
    const followingData = user.following.map((followingUser) => ({
      uniqueId: followingUser.uniqueId,
      username: followingUser.username,
      profilePic: followingUser.profilePic,
    }));

    res.json(followingData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFollowers = async (req, res) => {
  try {
    const user = await User.findOne({ uniqueId: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the details of each follower by querying the User model with the uniqueId
    const followerData = await Promise.all(
      user.followers.map(async (followerUniqueId) => {
        // Fetch the follower's data from the User collection using the uniqueId
        const followerUser = await User.findOne({
          uniqueId: followerUniqueId,
        }).select("uniqueId username profilePic");
        return followerUser;
      })
    );

    // Filter out any null or undefined values (in case any follower is not found)
    res.json(
      followerData.filter(
        (follower) => follower !== null && follower !== undefined
      )
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  googleLoginUser,
  loginUser,
  currentUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByUsername,
  toggleFollow,
  getFollowers,
  getFollowing,
  refreshAccessToken,
  sendOtpForReset,
  verifyOtpAndResetPassword
};
