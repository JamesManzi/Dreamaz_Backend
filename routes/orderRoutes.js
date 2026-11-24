
const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");

const router = express.Router();

const VALID_STATUSES = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
];


// GET ORDER STATISTICS
router.get("/orderStats", async (req, res) => {

    try {

        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            orderStatus: "Pending"
        });

        const deliveredOrders = await Order.countDocuments({
            orderStatus: "Delivered"
        });

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


// GET ALL ORDERS
router.get("/getAllOrders", async (req, res) => {

    try {

        const orders = await Order.find()
            .populate("buyer", "username name fullName email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders
        });

    } catch (error) {

        console.error("Fetching Orders Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });

    }

});


// UPDATE ORDER STATUS
router.put("/updateOrder/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const { orderStatus } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });

        }

        if (!VALID_STATUSES.includes(orderStatus)) {

            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });

        }

        const order = await Order.findById(id);

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        order.orderStatus = orderStatus;

        await order.save();

        // Retrieve saved document
        const updatedOrder = await Order.findById(id)
            .populate("buyer", "username name fullName email");

        console.log("Order successfully updated:", {
            id: updatedOrder._id,
            orderStatus: updatedOrder.orderStatus
        });

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (error) {

        console.error("Updating Order Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update order"
        });

    }

});


// DELETE ORDER
router.delete("/order/:id", async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });

        }

        const order = await Order.findByIdAndDelete(id);

        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (error) {

        console.error("Deleting Order Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete order"
        });

    }

});


module.exports = router;
