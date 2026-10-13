const User=require("../models/User");
const express=require("express");

const router=express.Router();


router.get("/admin/user",async(req,res)=>{
    try {
        const user=await User.findById(req.userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }

        res.status(201).json({
            success:true,
            user
        })
    } catch (error) {
        console.log("Fetching User Profile Error",error);
        return res.status(500).json({
            success:false,
            message:"Fetching User Profile Error"
        })
    }
})

module.exports=router;