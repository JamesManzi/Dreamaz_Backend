const User=require("../models/User");
const express=require("express");

const router=express.Router();


router.get("/users",async(req,res)=>{
    try {
        const users=await User.find();
        if(!users){
            return res.status(404).json({
                success:false,
                message:"Users not Found"
            })
        }

        res.json({
            success:true,
            users
        })
    } catch (error) {
        console.log("Fetching Users Error",error);
        res.status(500).json({
            success:false,
            message:"Fetching Users Error"
        })
    }
})

module.exports=router;
