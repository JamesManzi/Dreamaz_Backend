const express=require("express");
const User=require("../models/User");
const Product=require("../models/Product");
const router=express.Router();


router.get("/admin-dashboard/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const totalUsers=await User.countDocuments();
        const totalProducts=await Product.countDocuments();
        const availableProducts=await Product.countDocuments({
            availability:"available"
        });
        const soldProducts=await Product.countDocuments({
            availability:"sold"
        });
        const reservedProducts=await Product.countDocuments({
            availability:"reserved"
        });
        const categories=await Product.distinct("category");
        const totalCategories=categories.length;
        res.json({
            success: true,
            user,
            totalUsers,
            totalProducts,
            availableProducts,
            soldProducts,
            reservedProducts,
            totalCategories
        });

    } catch (error) {
        console.log("Admin Dashboard Error", error);

        res.status(500).json({
            success: false,
            message: "Admin Dashboard Error"
        });
    }
});

module.exports=router;