const express=require("express");
const Trending=require("../models/Trending");
const router=express.Router();
const {cloudinary,upload}=require("../cloudinary");

router.delete("/deleteTrending/:id",async(req,res)=>{
    try {
        const product=await Trending.findById(req.params.id);
        if(!product){
            return res.status(401).json({
                success:false,
                message:"Product not Found"
            })
        }

        if(product.files&&product.files.length>0){
            for(const file of product.files){
                await cloudinary.uploader.destroy(
                    file.public_id,
                    {
                        resource_type:file.type
                    }
                )
            }
        }
        const deletedProduct=await Trending.findByIdAndDelete(
            req.params.id,
            {
                new:true
            }
        );
        res.status(201).json({
            success:true,
            message:"Product Deleted Successfully"
        })
    } catch (error) {
        console.log("Delete Item Error",error);
        return res.status(500).json({
            success:false,
            message:"Delete Item Error"
        })
    }
})


module.exports=router;