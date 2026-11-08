const express=require("express");
const Product=require("../models/Product");

const router=express.Router();

router.get("/fashionAnimation",async(req,res)=>{
    try {
        const fashionProducts=await Product.find({category:"Fashion"});

        if(!fashionProducts){
            return res.status(404).json({
                success:false,
                message:"No Fashion products found"
            })
        }
        res.status(200).json({
            success:true,
            fashionProducts
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Fetching Fashion Products Error"
        })
    }
})

module.exports=router;