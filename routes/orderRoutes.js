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

router.delete("/order/:id",async(req,res)=>{
    try {
        const order=await Order.findById(req.params.id);
        if(!order){
            return res.status(404).json({
                success:false,
                message:"Order not Found"
            })
        }
        await Order.findByIdAndDelete(
            req.params.id,
            {
                new:true
            }
        );
        res.status(201).json({
            success:true,
            message:"Order Deleted Successfully"
        })
    } catch (error) {
        console.log("deleting orders Error",error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
})

router.put("/updateOrder/:id",async(req,res)=>{
    try {
        const order=await Order.findById(req.params.id);
        if(!order){
            return res.status(404).json({
                success:false,
                message:"Order not Found"
            })
        }
        await Order.findByIdAndUpdate(
            req.params.id,
            {
                new:true
            }
        );

        res.status(201).json({
            success:true,
            message:"Order Updated Successfully"
        })
    } catch (error) {
        console.log("Internal Server Error",error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
})

module.exports = router;