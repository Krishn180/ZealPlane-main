const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    coverImage: { type: String }, // optional
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);
