const express=require("express");
const bcrypt=require("bcryptjs");
const mongoose=require("mongoose");
const User=require("../models/User");
const {cloudinary,upload}=require("../cloudinary");
const router=express.Router();


router.put("/setting/:id", upload.single("profile"), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        const updateData = {};

        if (req.body.username) {
            updateData.username = req.body.username;
        }

        if (req.body.email) {
            updateData.email = req.body.email;
        }

        if (req.body.newPassword) {
            const isMatch = await bcrypt.compare(
                req.body.password,
                user.password
            );

            if (!isMatch) {
                return res.json({
                    success: false,
                    message: "Current Password is Incorrect"
                });
            }

            updateData.password = await bcrypt.hash(
                req.body.newPassword,
                10
            );
        }

        if (req.file) {
            updateData.profile =req.file.path;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select("-password");

        res.json({
            success: true,
            user: updatedUser,
            message: "User Updated Successfully"
        });

    } catch (error) {
        console.log("Update User Error", error);

        res.status(500).json({
            success: false,
            message: "Updating User Error"
        });
    }
});

module.exports=router;