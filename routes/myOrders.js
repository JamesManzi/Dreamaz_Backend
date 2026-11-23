const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// Get orders belonging to the logged-in buyer
router.get("/myOrders", async (req, res) => {
  try {
    const buyerId = req.userId;

    if (!buyerId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const orders = await Order.find({ buyer: buyerId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    console.error("Get My Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve your orders"
    });
  }
});

module.exports = router;