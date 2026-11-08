const express=require("express");
const Trending=require("../models/Trending");

const router=express.Router();

router.get("/fashionsTrends",async(req,res)=>{
    try {
        const fashions=await Trending.find({category:"Fashion"});
        if(!fashions){
            return res.status(400).json({
                success:false,
                message:"Products not Found"
            })
        }
    } catch (error) {
        console.log("Fetching TrendingFashions Error",error);
        return res.status(500).json({
            success:false,
            message:"Loading Fashions Error"
        })
    }
})