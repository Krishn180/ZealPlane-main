const mongoose = require("mongoose");

// Define the Comment Schema
const CommentSchema = new mongoose.Schema({
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
  author: { type: String },
  uniqueId: { type: String },
  profilePic: { type: String },
});

// Define the Vote Schema
const VoteSchema = new mongoose.Schema({
  uniqueId: { type: String },
  timestamp: { type: Date, default: Date.now },
  voteValue: { type: Number, enum: [1, -1] },
});

// Define the Post Schema
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  profilePic: { type: String },
  body: { type: String },
  subreddit: { type: String },
  uniqueId: { type: String },
  author: { type: String },
  timestamp: { type: Date, default: Date.now },
  votes: { type: [VoteSchema], default: [] },
  upvoteCount: { type: Number, default: 0 },
  comments: { type: [CommentSchema], default: [] },
  image: { type: String },

  // Post Type (image, text, quiz)
  postType: { type: String, enum: ["image", "text", "quiz"], required: true },

  // Quiz-specific fields (optional, used only if postType === 'quiz')
  question: { type: String },
  options: [{ type: String }],
});

// Export the Post model
module.exports = mongoose.model("Post", PostSchema);
