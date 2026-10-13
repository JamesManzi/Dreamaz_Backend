
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const compare = await bcrypt.compare(password, user.password);

        if (!compare) {
            return res.json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            success: true,
            message: "Login Successfully",
            token,
            user: {
                username: user.username,
                id: user._id,
                email: user.email
            }
        });

    } catch (error) {
        console.log("Login Error", error);

        return res.status(500).json({
            success: false,
            message: "Login Server Error"
        });
    }
});

module.exports = router;
