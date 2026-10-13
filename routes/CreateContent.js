const express=require("express");
const Content=require("../models/Content");
const {cloudinary,upload}=require("../cloudinary");

const router=express.Router();

router.post("/createContent",upload.array("files"),async(req,res)=>{
    try {
        const {name,artist}=req.body;
        if(!name||!artist){
            return res.status(400).json({
                success:false,
                message:"All fields required"
            })
        }

        const files=req.files
        ?req.files.map((file)=>({
            url:file.path,
            type:file.mimetype.startsWith("image/")
            ?"image"
            :"video"
        })):[];

        const createdContent=await Content.create({
            name,
            artist,
            files
        });

        res.json({
            success:true,
            createdContent,
            message:"Content Created Successfully"
        })
        
    } catch (error) {
        console.log("Creating Content Error",error);
        return res.status(500).json({
            success:false,
            message:"Creating Content Error"
        })
    }
})

module.exports=router;