const express=require("express");
const Gallery=require("../models/Gallery");
const {cloudinary,upload}=require("../cloudinary");
const User=require("../models/User");

const router=express.Router();


router.delete("/delete-gallery/:id",async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin Access Required"
            });
        }

        const gallery = await Gallery.findById(req.params.id);

        if (!gallery) {
            return res.status(404).json({
                success: false,
                message: "Gallery Not Found"
            });
        }


        // Delete files from Cloudinary
        for (const file of gallery.files) {

            if (file.public_id) {
                await cloudinary.uploader.destroy(
                    file.public_id,
                    {
                        resource_type: file.resource_type || "image"
                    }
                );

            }
        }

        // Delete gallery from MongoDB
        await Gallery.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Gallery Deleted Successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Deleting Gallery Error"
        });
    }
});

module.exports=router;
