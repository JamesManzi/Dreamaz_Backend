const express=require("express");
const Trending=require("Trending");
const router=express.Router();
import { upload } from "../config/cloudinary";

router.post("/createTrending",upload.array("files",10),async(req,res)=>{
    try {
        const {name,category,price,description}=req.body;
        if(!name||!category||!price||!description){
            return res.status(400).json({
                success:false,
                message:"All Fields Required"
            })
        }

        if(req.files){
            const files=req.files.map((file)=>file.path);
        }

        const createdTrending=await Trending.Create({
            name,
            category,
            price,
            description,
            files
        });
        res.status(200).json({
            success:true,
            createdTrending,
            message:"Product Created Successfully"
        })
    } catch (error) {
        console.log("Creating Product Error",error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
})


module.exports=router;