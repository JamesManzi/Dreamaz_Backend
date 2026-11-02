const express=require("express");
const User=require("../models/User");
const bcrypt=require("bcryptjs");
const router=express.Router();

router.post("/register",async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Please provide all required fields"
            })
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=await User.create({
            username,
            email,
            password:hashedPassword
        });
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            user:{
                id:newUser._id,
                username:newUser.username,
                email:newUser.email,
                role:newUser.role
            }
        })

    }catch(error){
        console.log("Registration error: ",error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
})

module.exports=router;