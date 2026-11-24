
const express = require("express");
const mongoose = require("mongoose");
const Trending = require("../models/Trending");
const router = express.Router();

const { cloudinary, upload } = require("../cloudinary");

// Import your actual authentication middleware
const { verifyToken } = require("../middleware/auth");

router.put(
    "/updateTrending/:id",
    verifyToken,
    upload.array("files"),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { name, category, description } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid trending ID"
                });
            }

            if (!name?.trim() || !category?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Name and category are required"
                });
            }

            const trending = await Trending.findById(id);

            if (!trending) {
                return res.status(404).json({
                    success: false,
                    message: "Trending entry not found"
                });
            }

            const originalFiles = [...(trending.files || [])];

            let existingFiles = originalFiles;

            if (req.body.existingFiles !== undefined) {
                let requestedFiles;

                try {
                    requestedFiles = JSON.parse(
                        req.body.existingFiles
                    );

                    if (!Array.isArray(requestedFiles)) {
                        throw new Error("Invalid files format");
                    }
                } catch {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid existing files data"
                    });
                }

                existingFiles = originalFiles.filter(oldFile =>
                    requestedFiles.some(requested =>
                        (
                            oldFile.public_id &&
                            requested.public_id === oldFile.public_id
                        ) ||
                        (
                            !oldFile.public_id &&
                            requested.url === oldFile.url
                        )
                    )
                );
            }

            const newFiles = (req.files || []).map(file => ({
                url: file.path,
                type: file.mimetype.startsWith("video/")
                    ? "video"
                    : "image",
                public_id: file.filename || file.public_id
            }));

            trending.name = name.trim();
            trending.category = category.trim();
            trending.description = description || "";

            trending.files = [
                ...existingFiles,
                ...newFiles
            ];

            const updatedItem = await trending.save();

            // Identify removed Cloudinary files.
            const retainedIds = new Set(
                updatedItem.files
                    .map(file => file.public_id)
                    .filter(Boolean)
            );

            const removedFiles = originalFiles.filter(
                file =>
                    file.public_id &&
                    !retainedIds.has(file.public_id)
            );

            // Clean up removed media.
            const cleanupResults = await Promise.allSettled(
                removedFiles.map(file =>
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
                message: "Trending entry updated successfully",
                updatedItem,
                cloudinaryCleanupFailed: failedCleanup
            });

        } catch (error) {
            console.error("Update Trending Error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to update trending entry",
                error: error.message
            });
        }
    }
);

module.exports = router;
