const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrdersByUser,
  getOrderById,
  markOrderAsDelivered,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/user/:userId", getOrdersByUser);
router.get("/:id", getOrderById);
router.put("/:id/deliver", markOrderAsDelivered);

module.exports = router;
