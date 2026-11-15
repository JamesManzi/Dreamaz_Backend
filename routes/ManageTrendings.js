const express=require("express");
const Trending=require("../models/Trending");
const router=express.Router();
const {cloudinary,upload}=require("../cloudinary");

router.put("/manageTrending",upload.array("files"),async(req,res)=>{
    try {
        const {name,category,price,description}=req.body;
        const product=await Trending.findById(req.params.id);
        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product Not Found"
            })
        }
        const updatedData={};
        if(req.body.name){
            updatedData.name=req.body.name
        }
        if(req.body.category){
            updatedData.category=req.body.category
        }
        if(req.body.price){
            updatedData.price=req.body.price
        }
        if(req.body.description){
            updatedData.description=req.body.description
        }
        if(req.files){
            updatedData.files=req.files.map((file)=>({
                                url:file.path,
                type:file.mimetype.startsWith("image/")
                ?"image":"video"
            }))
        }

        const updatedItem=await Trending.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {
                new:true
            }
        );
        res.status(201).json({
            success:true,
            updatedItem,
            message:"Item Updated Successfully"
        })
    } catch (error) {
        console.log("Updating Items Error",error);
        return res.status(500).json({
            success:false,
            message:"Updating Item Error"
        })
    }
})

module.exports=router;