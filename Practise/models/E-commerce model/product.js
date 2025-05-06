const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  inStock: { type: Boolean, default: true },
  quantity: { type: Number, default: 1 },
  tags: [String],
  category: { type: String }, // e.g., "Comics", "Merchandise"
  subcategory: { type: String },
  images: [String], // Array of image URLs
  thumbnail: { type: String },
  createdBy: {
    uniqueId: String,
    username: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
