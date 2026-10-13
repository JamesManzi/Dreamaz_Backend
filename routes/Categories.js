const express=require("express");
const Product=require("../models/Product");

const router=express.Router();

router.get("/getFashionProducts",async(req,res)=>{
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

router.get("/getAccessories",async(req,res)=>{
    try {
        const accessories=await Product.find({category:"Accessories"});
        if(accessories){
            return res.status(404).json({
                success:false,
                message:"No Accessories Found"
            })
        }

        res.status(200).json({
            success:true,
            accessories
        })
    } catch (error) {
        console.log("Fetching Accessories Error",error);
        return res.status(500).json({
            success:false,
            message:"Fetching Accessories Error"
        })
    }
})

router.get("/prints",async(req,res)=>{
    try {
        const prints=await Product.find({category:"Prints"});
        if(!prints){
            return res.status(404).json({
                success:false,
                message:"No Prints Found"
            })
        };

        res.status(200).json({
            success:false,
            prints
        })
    } catch (error) {
        console.log("Fetching Prints Error",error);
        return res.status(500).json({
            success:false,
            message:"Fetching Prints Error"
        })
    }
})


router.get("/Collections",async(req,res)=>{
    try {
        const collections=await Product.find({category:"Collections"});
        if(!collections){
            return res.status({
                success:false,
                message:"Fetching Collections"
            })
        }

        res.status(200).json({
            success:true,
            collections
        })
    } catch (error) {
        console.log("Fetching Collections Error",error);
        return res.status(500).json({
            success:false,
            message:"Fetching Collections Error"
        })
    }
})

module.exports=router;