const Order = require("../models/orderModel");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    } = req.body;

    if (!userId || !items || !shippingAddress || !paymentMethod || !totalAmount) {
      return res.status(400).json({ message: "❌ All required fields must be filled." });
    }

    const newOrder = new Order({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "✅ Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "❌ Failed to create order", error });
  }
};

// Get all orders for a user
const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).sort({ orderedAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "❌ Failed to fetch user orders", error });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate("items.productId");
    if (!order) {
      return res.status(404).json({ message: "❌ Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "❌ Failed to fetch order", error });
  }
};

// Update delivery status
const markOrderAsDelivered = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "❌ Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();
    res.status(200).json({ message: "✅ Order marked as delivered", order: updatedOrder });
  } catch (error) {
    console.error("Error updating delivery status:", error);
    res.status(500).json({ message: "❌ Failed to update delivery status", error });
  }
};

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrderById,
  markOrderAsDelivered,
};
