const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
    }
  ],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    contactNumber: String,
  },
  paymentMethod: { type: String, enum: ["COD", "Card", "UPI"], required: true },
  paymentStatus: { type: String, default: "Pending" },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  totalAmount: { type: Number },
  orderedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
