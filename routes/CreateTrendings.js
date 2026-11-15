
const express = require("express");
const Trending = require("../models/Trending");
const router = express.Router();
const {cloudinary,upload}=require("../cloudinary");

router.post(
    "/createTrending",
    upload.array("files"),
    async (req, res) => {
        try {
            const { name, category, price, description } = req.body;

            if (!name || !category || !description||!price) {
                return res.status(400).json({
                    success: false,
                    message: "All Fields Required"
                });
            }

           const files=req.files
           ?req.files.map((file)=>({
            url:file.path,
            type:file.mimetype.startsWith("image/")
            ?"image":"video"
           })):[];

            // Save to MongoDB
            const createdTrending = await Trending.create({
                name,
                category,
                description,
                price,
                files
            });

            return res.status(201).json({
                success: true,
                createdTrending,
                message: "Trending Product Created Successfully"
            });

        } catch (error) {

            console.log("Creating Trending Product Error:", error);

            return res.status(500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }
);

module.exports = router;
