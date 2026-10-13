const User=require("../models/User");
const express=require("express");

const router=express.Router();


router.get("/user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        res.json({
            success: true,
            user: user
        });

    } catch (error) {
        console.log("Get User Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to get user"
        });
    }
});

module.exports=router;