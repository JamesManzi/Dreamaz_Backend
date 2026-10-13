const express=require("express");
const Gallery=require("../models/Gallery");
const {cloudinary,upload}=require("../cloudinary");

const router=express.Router();


router.post(
    "/gallery",
    upload.array("files", 15),
    async (req, res) => {
        try {

            const {
                name,
                artist,
                category,
                description
            } = req.body;

            // Check required fields
            if (!name || !artist || !category || !description) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                });
            }

            // Make sure files were uploaded
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Please upload at least one image or video"
                });
            }

            // Convert uploaded files into the format
            // required by the Gallery schema
            const files = req.files.map((file) => ({
                url: file.path,
                public_id: file.filename,
                resource_type: file.resource_type || "image"
            }));

            console.log("Files being saved:", files);

            // Create gallery
            const savedGallery = await Gallery.create({
                name,
                artist,
                category,
                description,
                files
            });

            return res.status(201).json({
                success: true,
                gallery: savedGallery,
                message: "Gallery Created Successfully"
            });

        } catch (error) {

            console.error("Creating Gallery Error:", error);

            return res.status(500).json({
                success: false,
                message: error.message || "Creating Gallery Error"
            });
        }
    }
);

module.exports=router;