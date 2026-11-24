const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// Get total, pending, and delivered order counts
router.get("/orderStats", async (req, res) => {
    try {
        const totalOrders=await Order.countDocuments();
        const pendingOrders=await Order.countDocuments({orderStatus:"Pending"});
        const deliveredOrders=await Order.countDocuments({orderStatus:"Delivered"});

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
const VALID_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

// DELETE
router.delete("/order/:id", /* authMiddleware, */ async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        console.log("Deleting order error", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

// UPDATE ORDER STATUS
router.put("/updateOrder/:id", async (req, res) => {
    try {
        const { orderStatus } = req.body;

        console.log("Order ID:", req.params.id);
        console.log("New order status:", orderStatus);

        if (!VALID_STATUSES.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.orderStatus = orderStatus;

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        console.error("Updating order error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

// Get all orders
router.get("/getAllOrders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No orders found",
                orders: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders
        });

    } catch (error) {
        console.log("Fetching Orders Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

module.exports = router;