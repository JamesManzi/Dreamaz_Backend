
const express = require("express");
const mongoose = require("mongoose");
const Trending = require("../models/Trending");
const router = express.Router();

const { cloudinary } = require("../cloudinary");

// Import your actual authentication middleware
const { verifyToken } = require("../middleware/auth");

router.delete(
    "/deleteTrending/:id",
    verifyToken,
    async (req, res) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid trending ID"
                });
            }

            const trending = await Trending.findById(id);

            if (!trending) {
                return res.status(404).json({
                    success: false,
                    message: "Trending entry not found"
                });
            }

            // Delete database document.
            await Trending.findByIdAndDelete(id);

            // Clean up Cloudinary media.
            const cleanupResults = await Promise.allSettled(
                (trending.files || [])
                    .filter(file => file.public_id)
                    .map(file =>
                        cloudinary.uploader.destroy(
                            file.public_id,
                            {
                                resource_type:
                                    file.type === "video"
                                        ? "video"
                                        : "image"
                            }
                        )
                    )
            );

            const failedCleanup = cleanupResults.filter(
                result => result.status === "rejected"
            ).length;

            return res.status(200).json({
                success: true,
                message: "Trending entry deleted successfully",
                cloudinaryCleanupFailed: failedCleanup
            });

        } catch (error) {
            console.error("Delete Trending Error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to delete trending entry",
                error: error.message
            });
        }
    }
);

module.exports = router;
