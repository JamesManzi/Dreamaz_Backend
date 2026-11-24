
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true
        },

        // Local accounts use passwords.
        // Google accounts can have no password.
        password: {
            type: String,
            required: false,
            default: null
        },

        // Google's unique account identifier.
        googleId: {
            type: String,
            unique: true,
            sparse: true,
            default: undefined
        },

        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local"
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        profile: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
