const express=require("express");
const bcrypt=require("bcryptjs");
const User=require("../models/User");

const router=express.Router();


router.post("/create-user", async (req, res) => {
    try {
        const {username,email,password,role}=req.body;

        if (!username || !email || !password||!role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });

        }
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const newUser = await User.create({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role

        });

        return res.status(201).json({
            success: true,
            message: "User created successfully!",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role:newUser.role
            }

        });


    } catch (error) {

        console.log(
            "Create User Error:",
            error
        );
        return res.status(500).json({

            success: false,

            message: "Create User Error"

        });

    }

});

module.exports=router;