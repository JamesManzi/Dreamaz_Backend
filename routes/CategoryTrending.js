
const express = require("express");
const Trending = require("../models/Trending");

const router = express.Router();

router.get("/fashionTrends", async (req, res) => {
    try {
        const fashions = await Trending.find({
            category: "Fashion"
        });

        if (fashions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Fashion Products Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            fashionProducts: fashions
        });

    } catch (error) {
        console.log("Fetching Trending Fashions Error:", error);

        return res.status(500).json({
            success: false,
            message: "Loading Fashions Error"
        });
    }
});

module.exports = router;
