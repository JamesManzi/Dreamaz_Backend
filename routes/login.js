
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

require("dotenv").config();

const router = express.Router();

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

/* =========================================================
   CREATE APP JWT
========================================================= */
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

/* =========================================================
   NORMAL EMAIL/PASSWORD LOGIN
========================================================= */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        });

        // Google-only accounts might not have a password.
        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const compare = await bcrypt.compare(
            password,
            user.password
        );

        if (!compare) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = generateToken(user);

        return res.json({
            success: true,
            message: "Login Successfully",
            token,
            user: {
                username: user.username,
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Login Server Error"
        });
    }
});

/* =========================================================
   GOOGLE LOGIN / REGISTRATION
========================================================= */
router.post("/google", async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential is required"
            });
        }

        if (!process.env.GOOGLE_CLIENT_ID) {
            console.error("GOOGLE_CLIENT_ID is missing");

            return res.status(500).json({
                success: false,
                message: "Google authentication is not configured"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing");

            return res.status(500).json({
                success: false,
                message: "Authentication is not configured"
            });
        }

        // Verify the token directly with Google's servers.
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (
            !payload ||
            !payload.sub ||
            !payload.email ||
            payload.email_verified !== true
        ) {
            return res.status(401).json({
                success: false,
                message: "Google account could not be verified"
            });
        }

        const googleId = payload.sub;
        const email = payload.email.trim().toLowerCase();

        const username =
            payload.name?.trim() ||
            email.split("@")[0];

        // First search by Google's unique account ID.
        let user = await User.findOne({ googleId });

        if (!user) {
            // Check whether this email already has an account.
            user = await User.findOne({ email });

            if (user) {
                // Never silently connect a different Google account
                // to an account already linked to another Google ID.
                if (
                    user.googleId &&
                    user.googleId !== googleId
                ) {
                    return res.status(409).json({
                        success: false,
                        message: "This email is linked to another Google account"
                    });
                }

                // Link the verified Google identity to the existing user.
                user.googleId = googleId;

                if (!user.authProvider) {
                    user.authProvider = "local";
                }

                await user.save();

            } else {
                // Create a new Google user.
                user = await User.create({
                    username,
                    email,
                    googleId,
                    authProvider: "google",
                    password: null
                });
            }
        }

        // Issue the same application JWT used by normal login.
        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Google Login Successfully",
            token,
            user: {
                username: user.username,
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(
            "Google Authentication Error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Google authentication failed. Please try again."
        });
    }
});

module.exports = router;
