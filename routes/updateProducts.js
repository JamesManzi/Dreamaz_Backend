
const express = require("express");
const Product = require("../models/Product");
const { upload } = require("../config/cloudinary");

const router = express.Router();

// UPDATE PRODUCT
router.post(
    "/updateProduct/:id",
    upload.array("files", 15),
    async (req, res) => {
        try {

            const {
                name,
                price,
                category,
                availability,
                description,
                existingFiles
            } = req.body;

            // Validate product ID
            if (!req.params.id) {
                return res.status(400).json({
                    success: false,
                    message: "Product ID is required."
                });
            }

            // Validate required fields
            if (!name?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Product name is required."
                });
            }

            if (
                price === undefined ||
                price === "" ||
                !Number.isFinite(Number(price)) ||
                Number(price) < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Enter a valid product price."
                });
            }

            // Parse existing media
            let retainedFiles;

            try {
                retainedFiles = JSON.parse(existingFiles || "[]");

                if (!Array.isArray(retainedFiles)) {
                    throw new Error("Invalid media format");
                }

            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid existing media."
                });
            }

            // Newly uploaded Cloudinary files
            const newFiles = (req.files || []).map(file => ({
                url: file.path,
                type: file.mimetype.startsWith("image/")
                    ? "image"
                    : "video"
            }));

            // Update product
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    name: name.trim(),
                    price: Number(price),
                    category,
                    availability,
                    description,
                    files: [...retainedFiles, ...newFiles]
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!updatedProduct) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Product updated successfully.",
                product: updatedProduct
            });

        } catch (error) {

            console.error("Updating Product Error:", error);

            return res.status(500).json({
                success: false,
                message: error.message || "Unable to update product."
            });

        }
    }
);

module.exports = router;
