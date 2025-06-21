const asynchandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { get } = require("../contactsRoutes");
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
      googleId, // Will be generated in backend if not provided
    } = req.body;

    // Step 2: Check if the username or email already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      console.log("Username already exists:", usernameExists);
      res.status(400);
      throw new Error("Username already taken!");
    }

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      console.log("User already registered:", userAvailable);
      res.status(400);
      throw new Error("User with this email already registered!");
    }

    // Step 3: OTP Verification
    if (!otp) {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000);
      otpStore.set(email, generatedOtp);
      console.log(`Generated OTP for ${email}: ${generatedOtp}`);

      // Send OTP to user's email
      await sendOtpEmail(email, generatedOtp);

      return res.status(200).json({ message: "OTP sent to email!" });
    } else {
      const storedOtp = otpStore.get(email);
      console.log(`Stored OTP for ${email}:`, storedOtp);

      if (!storedOtp || parseInt(otp) !== storedOtp) {
        console.log("Invalid or expired OTP for email:", email);
        res.status(400);
        throw new Error("Invalid or expired OTP!");
      }

      otpStore.delete(email);
      console.log("OTP verified successfully for email:", email);
    }

    // Step 4: Hash the password
    let hashedPassword = null;
    if (!googleId) {
      console.log("Hashing password...");
      hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hashed Password:", hashedPassword);
    }

    // Step 5: Generate unique ID and status
    const uniqueId = uuidv4();
    const status = `Active-${uniqueId}`;
    console.log("Generated Unique ID and Status:", uniqueId, status);

    // Step 6: If googleId is not provided, generate a dummy googleId
    const generatedGoogleId = googleId || uuidv4(); // Generate googleId if not present

    // Step 7: Create a new user in the database
    console.log("Creating user in database...");
    const user = await User.create({
      username,
      email,
      password: googleId ? undefined : hashedPassword, // If googleId exists, skip the password field
      googleId: generatedGoogleId, // If googleId exists, set it here
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
    });

    console.log("User created successfully:", user);

    // Step 8: Send success response
    if (user) {
      res.status(201).json({
        _id: user.id,
        email: user.email,
        uniqueId: user.uniqueId,
        status: user.status,
      });
      console.log("User registration successful:", user.email);
    } else {
      console.log("Invalid user data");
      res.status(400);
      throw new Error("User data is not valid");
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: error.message });
  }
});

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
    const firstName = name.split(" ")[0]; // Extract first name and make it lowercase
    console.log("Extracted firstName:", firstName);

    // Check if the user already exists in your database
    let user = await User.findOne({ email });
    console.log("User found in database:", user);

    if (!user) {
      // Use the first name as the base username
      let username = firstName;

      let isUsernameTaken = true;
      let counter = 1;

      // Try creating a new user and handle duplicate username using error handling
      while (isUsernameTaken) {
        try {
          // Try creating the user with the generated username
          user = new User({
            fullName: name, // Save Google name in fullName
            email: email,
            profilePic: user.profilePic || picture,
            googleId: googleId,
            username: username, // Save the username
            password: "", // Password not required for Google-authenticated users
            uniqueId: uuidv4(),
            status: `Active-${uuidv4()}`,
          });

          await user.save(); // Attempt to save the new user
          console.log("New user created:", user);
          isUsernameTaken = false; // If save is successful, break out of the loop
        } catch (err) {
          // If a MongoDB unique constraint error occurs, it means the username is already taken
          if (err.code === 11000) {
            // Handle unique constraint violation error (duplicate username)
            console.log("Username is already taken. Trying again...");
            // Modify the username by appending a counter
            username = `${firstName}_${counter}`;
            counter++;
          } else {
            // For any other errors, rethrow them
            throw err;
          }
        }
      }
    } else {
      // If user exists, update the fullName only if it's null
      if (!user.fullName) {
        user.fullName = name;
      }
      if (!user.profilePic) {
        user.profilePic = picture;
      }

      await user.save();
      console.log("User updated with Google info:", user);
    }

    // Generate a JWT for your application
    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        uniqueId: user.uniqueId,
        username: user.username,
        profilePic: user.profilePic,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // Access token expires in 5 seconds
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" } // Refresh token expires in 30 days
    );

    console.log("Generated access token:", accessToken);

    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        username: user.username, // Include the unique username in the response
        id: user.uniqueId,
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

  // Step 2: Compare the password provided with the hashed password in the database
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
    { expiresIn: "1h" } // Access token expires in 1 hour
  );
  console.log("Access token generated successfully for user:", email);

  // Step 4: Generate refresh token
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" } // Refresh token expires in 30 days
  );
  console.log("Refresh token generated successfully for user:", email);

  // Step 5: Send refresh token as an HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: "Strict", // Ensures the cookie is sent only in requests to the same domain
  });
  console.log("Refresh token set in cookies");

  // Step 6: Send the access token and user details in the response body
  res.status(200).json({
    _id: user._id,
    email: user.email,
    username: user.username,
    fullName: user.fullName,
    profilePic: user.profilePic,
    jobRole: user.jobRole,
    token: accessToken, // Access token
    refreshToken: refreshToken, // Refresh token
    id: user.uniqueId,
  });
  console.log("User login successful for:", email);
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
};
