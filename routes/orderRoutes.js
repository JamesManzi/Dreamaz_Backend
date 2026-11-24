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

// UPDATE STATUS
router.put("/updateOrder/:id", /* authMiddleware, */ async (req, res) => {
    try {
        const { status } = req.body;

        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order updated successfully",
            order
        });
    } catch (error) {
        console.log("Updating order error", error);
        res.status(500).json({
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