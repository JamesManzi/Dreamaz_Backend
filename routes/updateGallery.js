const express=require("express");
const Gallery=require("../models/Gallery");
const User=require("../models/User");
const router=express.Router();
const {cloudinary,upload}=require("../cloudinary");

router.put("/manage-gallery/:id",upload.array("files",15),async(req,res)=>{
    try {
         const user=await User.findById(req.userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }

        if(user.role!=="admin"){
            return res.json({
                success:false,
                message:"Admin Access Required"
            })
        }

        const gallery=await Gallery.findById(req.params.id);

        if(!gallery){
            return res.status(404).json({
                success:false,
                message:"Gallery Not Found"
            })
        }

        const updateData={};

        if(req.body.name){
            updateData.name=req.body.name;
        }

        if(req.body.category){
            updateData.category=req.body.category;
        }

        if(req.body.description){
            updateData.description=req.body.description;
        }
            if (req.files && req.files.length > 0) {
    const newFiles = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
        resource_type: file.mimetype.startsWith("video/")
            ? "video"
            : "image"
    }));

    updateData.files = [
        ...(gallery.files || []),
        ...newFiles
    ];
}

        const UpdatedGallery=await Gallery.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new:true}
        );

        res.status(201).json({
            success:true,
            UpdatedGallery,
            message:"Gallery Updated Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Updating Gallery Error"
        })
    }
})

module.exports=router;