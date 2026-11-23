const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// Get total, pending, and delivered order counts
router.get("/orderStats", async (req, res) => {
    try {
        const [totalOrders, pendingOrders, deliveredOrders] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ status: "pending" }),
            Order.countDocuments({ status: "delivered" })
        ]);

        return res.status(200).json({
            success: true,
            totalOrders,
            pendingOrders,
            deliveredOrders
        });
    } catch (error) {
        console.error("Order Stats Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch order statistics"
        });
    }
});

// Get total orders only
router.get("/totalOrders", async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();

        return res.status(200).json({
            success: true,
            totalOrders
        });
    } catch (error) {
        console.error("Total Orders Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch total orders"
        });
    }
});

// Get pending orders only
router.get("/pendingOrders", async (req, res) => {
    try {
        const pendingOrders = await Order.countDocuments({ status: "pending" });

        return res.status(200).json({
            success: true,
            pendingOrders
        });
    } catch (error) {
        console.error("Pending Orders Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pending orders"
        });
    }
});

// Get delivered orders only
router.get("/deliveredOrders", async (req, res) => {
    try {
        const deliveredOrders = await Order.countDocuments({ status: "delivered" });

        return res.status(200).json({
            success: true,
            deliveredOrders
        });
    } catch (error) {
        console.error("Delivered Orders Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch delivered orders"
        });
    }
});

module.exports = router;