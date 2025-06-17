const express = require("express");
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  getProjectsByUsername,
  createProject,
  updateProject,
  addThumbnailImage,
  getCommentById,
  updateComment,
  deleteComment,
  likeProject,
  commentOnProject,
  deleteProject,
} = require("../controllers/projectController");

const ValidateToken = require("../midleware/validateTokenHandler");

// ✅ Import individual middleware functions
const {
  singleThumbnail,
  multipleImages,
  singleThumbnailOrPdf,
} = require("../midleware/projectUpload");

// Route to get all projects
router.get("/", getAllProjects);

// Route to get project by ID (optional token)
router.get(
  "/id/:projectId",
  (req, res, next) => {
    if (req.headers.authorization) {
      ValidateToken(req, res, next);
    } else {
      next();
    }
  },
  getProjectById
);

// Get projects by username
router.get("/username/:username", getProjectsByUsername);

// Create new project
router.post("/", singleThumbnail, createProject);

// Update project
router.put("/id/:projectId", [singleThumbnail, multipleImages], updateProject);

// Delete project
router.delete("/id/:projectId", ValidateToken, deleteProject);

// ✅ Upload PDF or image thumbnail
router.post("/id/:projectId", singleThumbnailOrPdf, addThumbnailImage);

// Comment on project
router.post("/:projectId", ValidateToken, commentOnProject);

// Update comment
router.put("/:projectId/comments/:commentId", ValidateToken, updateComment);

// Delete comment
router.delete("/:projectId/:commentId", deleteComment);

// Like/unlike
router.post("/:projectId/like", ValidateToken, likeProject);

// Get specific comment
router.get("/:projectId/:commentId", getCommentById);

module.exports = router;
