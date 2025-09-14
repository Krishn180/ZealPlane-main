const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Project = require("../models/projectModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const convertPdfToImages = require("../utils/convertPdfToImages");
const { createNotification } = require("./notificationController");
const { addPoints } = require("../controllers/gamificationController");


const getAllProjects = async (req, res) => {
  try {
    // Find projects where thumbnailImage is not null or an empty string, and thumbnailImages array is not null or empty
    const projects = await Project.find({
      thumbnailImage: { $ne: null, $ne: "" }, // Ensure thumbnailImage is neither null nor empty
      $and: [
        { thumbnailImages: { $ne: null } }, // Ensure thumbnailImages is not null
        { thumbnailImages: { $not: { $size: 0 } } }, // Ensure thumbnailImages is not an empty array
      ],
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.user?.id;
    const usernameFromToken = req.user?.username;

    const userIp =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress;

    const project = await Project.findOne({ projectId });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const status = usernameFromToken === project.username ? "admin" : "visitor";

    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const hasRecentView = project.viewers.some((viewer) => {
      const lastViewed = new Date(viewer.viewedAt);
      if (userId && viewer.userId?.toString() === userId && lastViewed > sixHoursAgo)
        return true;
      if (!userId && viewer.ip === userIp && lastViewed > sixHoursAgo) return true;
      return false;
    });

    const hasEverViewed = project.viewers.some((viewer) => {
      if (userId && viewer.userId?.toString() === userId) return true;
      if (!userId && viewer.ip === userIp) return true;
      return false;
    });

    if (!hasRecentView) {
      const viewerData = {
        viewedAt: new Date(),
        ...(userId ? { userId } : { ip: userIp }),
      };

      project.viewers.push(viewerData);
      project.views = (project.views || 0) + 1;

      // ✅ Award points using addPoints helper
      if (userId && status === "visitor") {
        project.awardedPoints = project.awardedPoints || [];

        const alreadyAwarded = project.awardedPoints.some(
          (record) => record.userId.toString() === userId
        );

        if (!alreadyAwarded) {
          // Use the centralized addPoints controller
          await addPoints(userId, 20, "viewProject", projectId);

          // Mark points as awarded
          project.awardedPoints.push({ userId });
        }
      }

      await project.save();
    }

    res.status(200).json({
      project,
      status,
      totalViews: project.views,
      viewers: project.viewers,
      viewStatus: hasRecentView
        ? "Already viewed within last 6 hours."
        : "New view recorded.",
    });
  } catch (err) {
    console.error("Error fetching project:", err.message);
    res.status(500).json({ message: err.message });
  }
};


/* 
================ Test Case Example =================
1. User A views User B's project for the first time:
   - status = "visitor"
   - points awarded = 20
2. User B views their own project:
   - status = "admin"
   - points awarded = 0
3. User A views same project again within 6 hours:
   - view count increases, but no points awarded
4. Anonymous visitor (no userId) views project:
   - view count increases, but no points awarded
=====================================================
*/

// Get all projects by username (search query)
const getProjectsByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    // Use a regular expression to search for projects with usernames that match
    const projects = await Project.find({
      username: { $regex: username, $options: "i" }, // Case-insensitive search
    });

    if (projects.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for this username" });
    }

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// const trackProjectView = async (req, res) => {
//   try {
//     console.log("🔹 Incoming request headers:", req.headers);
//     console.log("🔹 Params:", req.params);

//     const slug = req.params.projectId;
//     const projectId = slug.split("-")[0]; // Extract ObjectId

//     // 1. Check for token
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       console.log("⚠️ Authorization header missing or invalid");
//       return res.status(401).json({ message: "Unauthorized: Token missing" });
//     }

//     const token = authHeader.split(" ")[1];
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log("🔹 Decoded token:", decoded);
//     } catch (err) {
//       console.log("⚠️ Invalid token:", err.message);
//       return res.status(401).json({ message: "Unauthorized: Invalid token" });
//     }

//     // 2. Check if uniqueId present
//     const uniqueId = decoded?.uniqueId;
//     if (!uniqueId) {
//       console.log("⚠️ uniqueId missing in token payload");
//       return res.status(401).json({ message: "Unauthorized: UniqueId missing" });
//     }

//     // 3. Find project
//     const project = await Project.findById(projectId);
//     if (!project) {
//       console.log("⚠️ Project not found:", projectId);
//       return res.status(404).json({ message: "Project not found" });
//     }

//     // 4. Check if this uniqueId already viewed
//     const alreadyViewed = project.viewers.some((v) => v.uniqueId === uniqueId);

//     if (!alreadyViewed) {
//       console.log("🔹 Adding new viewer:", uniqueId);
//       project.viewers.push({
//         uniqueId,
//         viewedAt: new Date(),
//       });
//       project.views += 1;

//       await User.findOneAndUpdate(
//         { uniqueId },
//         { $inc: { points: 20 } },
//         { new: true }
//       );
//     } else {
//       console.log("ℹ️ User already viewed:", uniqueId);
//     }

//     await project.save();
//     console.log("✅ View tracked successfully, total views:", project.views);

//     return res.json({
//       message: "✅ View tracked successfully",
//       views: project.views,
//     });
//   } catch (err) {
//     console.error("❌ trackProjectView error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };




const createProject = async (req, res) => {
  const {
    name,
    description,
    username,
    uniqueId,
    id,
    tags,
    subtags,
    publisher,
    teammates,
    ratings,
    profilePic,
  } = req.body;

  const userId = req.user?.id; // Assuming user ID comes from auth middleware

  const thumbnailImage = req.file ? req.file.path : null;
  const images = req.files ? req.files.map((file) => file.path) : [];

  if (!id || !username) {
    return res.status(400).json({ message: "Username and id are required." });
  }

  const project = new Project({
    name,
    description,
    thumbnailImage,
    images,
    username,
    projectId: new mongoose.Types.ObjectId(),
    id,
    uniqueId,
    tags,
    subtags,
    publisher,
    teammates,
    ratings,
    profilePic,
  });

  try {
    const newProject = await project.save();

    // ✅ Award points for creating a project
    if (userId) {
      await addPoints(userId, 50, "createProject", newProject.projectId.toString()); 
      // 50 points is just an example, you can change the value
    }

    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const addThumbnailImage = async (req, res) => {
  try {
    const { projectId } = req.body;

    console.log("Received request to add a thumbnail image.");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const newThumbnail = req.file ? req.file.path : null;
    console.log("New thumbnail path:", newThumbnail);

    if (!newThumbnail) {
      console.log("No thumbnail image uploaded.");
      return res.status(400).json({ message: "No thumbnail image uploaded." });
    }

    // Ensure the projectId is provided
    if (!projectId) {
      console.log("No projectId provided.");
      return res.status(400).json({ message: "Project ID is required." });
    }

    // Convert projectId to ObjectId and attempt to find and update the project with the new thumbnail image
    const updatedProject = await Project.findOneAndUpdate(
      { projectId: new mongoose.Types.ObjectId(projectId) },
      { $push: { thumbnailImages: newThumbnail } }, // Use $push to add the new thumbnail image to the array
      { new: true }
    );

    if (!updatedProject) {
      console.log(`Project with ID ${projectId} not found.`);
      return res.status(404).json({ message: "Project not found." });
    }

    console.log("Project updated successfully:", updatedProject);
    res.status(200).json(updatedProject);
  } catch (err) {
    console.error("Error occurred while updating the project:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const updateProject = async (req, res) => {
  const { name, description, tags, subtags, publisher, teammates, ratings } =
    req.body;

  // Extract the Cloudinary URLs of uploaded files
  const thumbnailImage = req.file ? req.file.path : null; // req.file.path is the URL for Cloudinary
  const additionalImages = req.files ? req.files.map((file) => file.path) : []; // req.files.map(file => file.path) gives URLs

  try {
    // Find the project to update
    const project = await Project.findOne({ projectId: req.params.projectId });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update the project's fields
    project.name = name || project.name;
    project.description = description || project.description;
    project.thumbnailImage = thumbnailImage || project.thumbnailImage;
    project.images =
      additionalImages.length > 0
        ? [...project.images, ...additionalImages]
        : project.images;
    project.tags = tags || project.tags;
    project.subtags = subtags || project.subtags;
    project.publisher = publisher || project.publisher;
    project.teammates = teammates || project.teammates;
    project.ratings = ratings || project.ratings;

    // Save the updated project
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params; // Get projectId from the request params

    // Ensure the projectId is provided
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    // Find the project by its projectId
    const project = await Project.findOne({ projectId });

    // If the project doesn't exist, return a 404 response
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Optionally, you can add authorization checks here, like checking if the user is the project owner
    const uniqueIdFromToken = req.user.uniqueId;
    if (uniqueIdFromToken !== project.uniqueId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this project" });
    }

    // Delete the project
    await Project.deleteOne({ projectId });

    // Return a success response
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    // Handle any errors during the deletion process
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    const { projectId, commentId } = req.params;

    // Find the project by its projectId
    const project = await Project.findOne({ projectId });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Find the comment by its _id (commentId)
    const comment = project.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json({ comment });
  } catch (err) {
    console.error(err); // Log error for debugging
    return res.status(500).json({ message: err.message });
  }
};

const commentOnProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { commentText, ratingValue } = req.body;

    // Extract sender details from JWT
    const senderUniqueId = req.user.uniqueId;
    const userId = req.user.id; // MongoDB _id for addPoints
    const username = req.user.username;
    const profilePic = req.user.profilePic;

    if (!commentText || commentText.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    if (ratingValue && (ratingValue < 1 || ratingValue > 5)) {
      return res
        .status(400)
        .json({ message: "Rating value must be between 1 and 5" });
    }

    // Find the project
    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Create new comment
    const newComment = {
      uniqueId: senderUniqueId,
      username,
      profilePic,
      commentText,
      date: new Date(),
    };

    project.comments.push(newComment);

    // Handle ratings
    if (ratingValue) {
      const newRating = { uniqueId: senderUniqueId, ratingValue, date: new Date() };
      project.ratings.push(newRating);

      const totalRatings = project.ratings.length;
      const sumOfRatings = project.ratings.reduce(
        (sum, rating) => sum + rating.ratingValue,
        0
      );
      project.averageRating = sumOfRatings / totalRatings;
    }

    // Save project
    const updatedProject = await project.save();

    // Retrieve the just-added comment's _id
    const addedComment = project.comments[project.comments.length - 1];

    // Send notification only if commenter is NOT the owner
    if (String(project.uniqueId) !== String(senderUniqueId)) {
      await createNotification(
        project.uniqueId,      // recipient → project owner
        senderUniqueId,        // sender → commenter
        `${username} commented on your project "${project.name}"`,
        projectId,             // project ID
        addedComment._id       // comment ID
      );
    }

    // ✅ Award points for commenting
    if (userId) {
      await addPoints(userId, 10, "commentOnProject", projectId); // 10 points example
      if (ratingValue) {
        await addPoints(userId, 5, "rateProject", projectId); // optional extra for rating
      }
    }

    return res.status(200).json({
      message: "Comment and rating added successfully",
      comment: addedComment,
      averageRating: project.averageRating,
      updatedProject,
    });
  } catch (err) {
    console.error("Error in commentOnProject:", err);
    return res.status(500).json({ message: err.message });
  }
};



const updateComment = async (req, res) => {
  const { projectId, commentId } = req.params; // Extract projectId and commentId from request params
  const { commentText } = req.body; // Get the updated comment text from the request body
  const uniqueId = req.user.uniqueId; // Get the authenticated user ID from the token

  try {
    // Find the project by its projectId
    const project = await Project.findOne({ projectId });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Find the comment by its commentId
    const comment = project.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is the owner of the comment
    if (comment.uniqueId !== uniqueId) {
      return res
        .status(403)
        .json({ message: "You can only edit your own comment" });
    }

    // Update   the comment text
    comment.commentText = commentText; // Update the commentText field

    // Save the updated project
    const updatedProject = await project.save();

    // Return the updated comment
    const updatedComment = updatedProject.comments.id(commentId);
    return res.status(200).json({ comment: updatedComment });
  } catch (err) {
    console.error(err); // Log error for debugging
    return res.status(500).json({ message: err.message });
  }
};

// Delete a comment from a project
const deleteComment = async (req, res) => {
  const { commentId } = req.params; // Assuming commentId is in the request params

  if (!commentId) {
    return res.status(400).json({ message: "Comment ID is required" });
  }

  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the comment exists
    const commentExists = project.comments.id(commentId);
    if (!commentExists) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Remove the comment using filter
    project.comments = project.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    // Save the updated project
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res
      .status(500)
      .json({ message: "An error occurred while deleting the comment" });
  }
};

const likeProject = async (req, res) => {
  try {
    // Find the project by projectId
    const project = await Project.findOne({
      projectId: req.params.projectId,
    }).populate("likedBy", "username"); // Populate 'likedBy' with user data

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ensure likedBy is initialized as an array
    if (!project.likedBy) {
      project.likedBy = [];
    }

    const userId = req.user.userId; // Assuming req.user contains the user ID after authentication

    // Check if the user has already liked the project
    const userIndex = project.likedBy.findIndex(
      (user) => user._id.toString() === userId
    );

    // If the user hasn't liked the project, add the like
    if (userIndex === -1) {
      project.likes += 1;
      project.likedBy.push(userId); // Add user to likedBy array
    } else {
      // If the user already liked the project, remove the like
      project.likes -= 1;
      project.likedBy.splice(userIndex, 1); // Remove user from likedBy array
    }

    // Save the updated project
    const updatedProject = await project.save();

    // Now, calculate the total likes for all projects belonging to the user
    const user = await User.findById(req.user.userId); // Get the user object
    if (user) {
      // Use aggregation to get the total likes across all the user's projects
      const totalLikes = await Project.aggregate([
        { $match: { username: user.username } }, // Filter projects by the user's username
        { $group: { _id: null, totalLikes: { $sum: "$likes" } } } // Sum the likes
      ]);

      // If total likes exist, update the totalLikes field in the user model
      if (totalLikes.length > 0) {
        user.totalLikes = totalLikes[0].totalLikes;
        await user.save(); // Save the updated totalLikes in the user model
      }
    }

    // Re-populate likedBy to include user details after saving
    const populatedProject = await Project.findById(updatedProject._id).populate("likedBy", "username");

    // Return the updated project with the total likes
    res.json({
      project: populatedProject,
      totalLikes: user ? user.totalLikes : 0, // Send back the updated totalLikes
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  getProjectsByUsername,
  createProject,
  updateProject,
  commentOnProject,
  updateComment,
  deleteComment,
  likeProject,
  addThumbnailImage,
  getCommentById,
  deleteProject
};
