
const express = require("express");
const Trending = require("../models/Trending");
const router = express.Router();
const { cloudinary } = require("../cloudinary");

router.delete("/deleteTrending/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!require("mongoose").Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid trending ID"
            });
        }

        // Find and delete the trending document
        const trending = await Trending.findByIdAndDelete(id);

        if (!trending) {
            return res.status(404).json({
                success: false,
                message: "Trending entry not found"
            });
        }

        // Clean up Cloudinary files separately
        const cleanupResults = await Promise.allSettled(
            (trending.files || [])
                .filter(file => file.public_id)
                .map(file =>
                    cloudinary.uploader.destroy(
                        file.public_id,
                        {
                            resource_type:
                                file.type === "video" ? "video" : "image"
                        }
                    )
                )
        );

        const failedCleanup = cleanupResults.filter(
            result => result.status === "rejected"
        );

        return res.status(200).json({
            success: true,
            message: "Trending entry deleted successfully",
            cloudinaryCleanupFailed: failedCleanup.length
        });

    } catch (error) {
        console.error("Delete Trending Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete trending entry",
            error: error.message
        });
    }
});

module.exports = router;
