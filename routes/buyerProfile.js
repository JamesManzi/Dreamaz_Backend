const express=require("express");
const User=require("../models/User");
const router=express.Router();

router.get("/buyerProfile",async(req,res)=>{
    try {
        const user=await User.findById(req.userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        res.status(201).json({
            success:true,
            user
        })
    } catch (error) {
        console.log("Profile Error",error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
})


router.put("/updateBuyer",async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        const user=await User.findById(req.userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not Found"

            });
        }
        const updatedData={};
        if(req.body.username){
            updatedData.username=req.body.username;
        }
        if(req.body.email){
            updatedData.email=req.body.email;
        }
        if(req.body.password){
            updatedData.password=req.body.password;
        }
        const updatedUser=await User.findByIdAndUpdate(
            req.userId,
            updatedData,
            {
                new:true
            }
        );
        res.status(201).json({
            success:true,
            updatedUser,
            message:"User Updated Successfully"
        })
    } catch (error) {
        console.log("Update Profile Error",error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
})


module.exports=router;