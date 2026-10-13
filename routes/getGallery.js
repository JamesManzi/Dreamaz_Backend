const express=require("express");
const Gallery=require("../models/Gallery");

const router=express.Router();


router.get("/gallery", async (req, res) => {
    try {
        const galleries= await Gallery.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            gallery: galleries
        });

    } catch (error) {
        console.error("Loading Gallery Error:", error);

        return res.status(500).json({
            success: false,
            message: "Loading Gallery Error"
        });
    }
});

router.get("/gallery/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const gallery = await Gallery.findById(id);

        if (!gallery) {

            return res.status(404).json({
                success: false,
                message: "Gallery not found"
            });

        }

        res.json({
            success: true,
            gallery
        });

    } catch (error) {

        console.error("Get Gallery Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get gallery"
        });

    }

});

module.exports=router;