const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Project = require("../models/projectModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const convertPdfToImages = require("../utils/convertPdfToImages");


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
    console.log("Received request to fetch project details.");

    const projectId = req.params.projectId;
    console.log("Extracted projectId:", projectId);

    const userId = req.user?.id; // Get unique userId from token
    const usernameFromToken = req.user?.username; // Extract username from token
    console.log("Extracted userId from token:", userId);
    console.log("Extracted username from token:", usernameFromToken);

    const userIp =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress;
    console.log("Extracted user IP:", userIp);

    // Fetch the project from the database
    const project = await Project.findOne({ projectId });

    if (!project) {
      console.log("Project not found in the database.");
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("Project found:", project);
    console.log("Project username:", project?.username);

    // 🛑 New Strategy: Check if user is the owner
    let status = "visitor"; // Default status
    if (usernameFromToken === project.username) {
      status = "admin";
    }

    console.log("User status:", status);

    // Check if the userId or IP has already viewed the project
    const hasViewed = project.viewers.some(
      (viewer) =>
        (userId && viewer.userId?.toString() === userId) ||
        (!userId && viewer.ip === userIp)
    );

    console.log("Has user already viewed the project?", hasViewed);

    let viewStatus = "View count updated.";
    let updateData = { $inc: { views: 1 } };

    if (!hasViewed) {
      console.log("New viewer detected, adding to the viewers list.");

      const readableTimestamp = new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      console.log("Generated timestamp:", readableTimestamp);

      const viewerData = userId
        ? { userId, viewedAt: readableTimestamp }
        : { ip: userIp, viewedAt: readableTimestamp };

      console.log("Viewer data to be added:", viewerData);

      updateData.$push = { viewers: viewerData };

      viewStatus = "New viewer recorded successfully.";
    }

    // Update the project document
    const updatedProject = await Project.findByIdAndUpdate(
      project._id,
      updateData,
      { new: true }
    );

    console.log("Final response being sent.");
    res.status(200).json({
      project: updatedProject,
      status, // Include user status
      totalViews: updatedProject.views,
      viewers: updatedProject.viewers,
      viewStatus,
    });
  } catch (err) {
    console.error("Error fetching project:", err.message);
    res.status(500).json({ message: err.message });
  }
};

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

// Create a new project
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
    const { projectId } = req.params; // Extract projectId from request params
    const { commentText, ratingValue } = req.body; // Get comment text and rating value
    const userId = req.user.userId; // Get user ID from req.user (decoded token)
    const username = req.user.username; // Get username from decoded token
    const profilePic = req.user.profilePic; // Get profilePic from decoded token
    const uniqueId = req.user.uniqueId;
    // Check if commentText is provided
    if (!commentText || commentText.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Check if ratingValue is provided and valid (1-5)
    if (ratingValue && (ratingValue < 1 || ratingValue > 5)) {
      return res
        .status(400)
        .json({ message: "Rating value must be between 1 and 5" });
    }

    // Find the project by its projectId
    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Create a new comment object
    const newComment = {
      userId,
      uniqueId,
      username,
      profilePic,
      commentText, // Include commentText
      date: new Date(), // Set the comment date to the current date
    };

    // Add the new comment to the project's comments array
    project.comments.push(newComment);

    // Handle the rating if provided
    if (ratingValue) {
      const newRating = {
        userId,
        ratingValue,
        date: new Date(), // Set the rating date to the current date
      };

      // Add the rating to the project's ratings array
      project.ratings.push(newRating);

      // Calculate the new average rating
      const totalRatings = project.ratings.length;
      const sumOfRatings = project.ratings.reduce(
        (sum, rating) => sum + rating.ratingValue,
        0
      );
      project.averageRating = sumOfRatings / totalRatings; // Calculate average rating
    }

    // Save the updated project with the new comment and/or rating
    const updatedProject = await project.save();

    return res.status(200).json({
      message: "Comment and rating added successfully",
      comment: newComment, // Return the newly added comment
      averageRating: project.averageRating, // Return updated average rating
      updatedProject, // Optionally return the updated project
    });
  } catch (err) {
    console.error(err); // Log error for debugging
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
  deleteProject,
};
