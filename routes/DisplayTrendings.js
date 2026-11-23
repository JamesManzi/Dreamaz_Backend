
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Trending = require("../models/Trending");

// 1. Fetch all trending artwork
router.get("/getTrending", async (req, res) => {
    try {

        const { category } = req.query;

        const filter = {};

        if (category && category !== "all") {
            filter.category = category;
        }

        const trending = await Trending.find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: trending.length,
            trending
        });

    } catch (error) {

        console.error("Fetch trending error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch trending artwork",
            error: error.message
        });
    }
});


// 2. Fetch one trending record by ID
router.get("/getTrending/:id", async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID"
            });
        }

        const trending = await Trending.findById(id);

        if (!trending) {
            return res.status(404).json({
                success: false,
                message: "Trending item not found"
            });
        }

        return res.status(200).json({
            success: true,
            trending
        });

    } catch (error) {

        console.error("Get trending error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// 3. Fetch related trending records
router.get("/related/:id", async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID"
            });
        }

        const current = await Trending.findById(id);

        if (!current) {
            return res.status(404).json({
                success: false,
                message: "Trending item not found"
            });
        }

        const related = await Trending.find({
            category: current.category,
            _id: { $ne: current._id }
        })
        .sort({ createdAt: -1 })
        .limit(8);

        return res.status(200).json({
            success: true,
            count: related.length,
            related
        });

    } catch (error) {

        console.error("Related trending error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
