const express=require("express");
const Content=require("../models/Content");
const {cloudinary,upload}=require("../cloudinary");

const router=express.Router();

router.delete("/deleteContent/:id",async(req,res)=>{
    try {
        const content=await Content.findById(req.params.id);
        if(!content){
            return res.status(404).json({
                success:false,
                message:"Content not Found"
            })
        }

        if(content.files&&content.files.length>0){
            for(const file of content.files){
                if(content.public_id){
                    await cloudinary.uploader.destroy(
                        file.public_id,
                        {
                            type:file.type
                        }
                    )
                }
            }
        }

        const deletedContent=await Content.findByIdAndDelete(
            req.params.id,
            {
                new:true
            }
        );

       res.status(200).json({
        success:true,
        deletedContent,
        message:"Content deleted successfully"
       })
    } catch (error) {
        console.log("Deleting Content Error",error);
        return res.status(500).json({
            success:false,
            message:"Deleting Content Error"
        })
    }
})


router.put("/updateContent/:id",upload.array("files"),async(req,res)=>{
    try {
        const {name,artist}=req.body;
        const updatedData={};
        if(req.body.name){
            updatedData.name=req.body.name;
        }

        if(req.body.artist){
            updatedData.artist=req.body.artist
        }

        if(req.files&&req.files.length>0){
            updatedData.files=req.files.map((file)=>({
                url:file.path,
                type:file.mimetype.startsWith("image/")
                ?"image"
                :"video"
            }))
        }

        const UpdatedContent=await Content.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {
                new:true
            }
        );

        res.status(200).json({
            success:true,
            UpdatedContent,   
            message:"Content Updated Successfully"     
        })
    } catch (error) {
        console.log("Updating Content Error",error);
        return res.status(500).json({
            success:false,
            message:"Updating Content Error"
        })
    }
})

module.exports=router;