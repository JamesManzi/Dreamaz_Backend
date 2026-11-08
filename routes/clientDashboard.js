const express=require('express');
const User=require("../models/User");
const Product=require("../models/Product");

const router=express.Router();

router.get("/clientDashboard",async(req,res)=>{
    try {
        const user=await User.findById(req.userId);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User Not Found"
            })
        }

        const products=await Product.find();
        if(!products){
            return res.status(400).json({
                success:false,
                message:"products no found"
            })
        }

        res.status(201).json({
            success:true,
            user,
            products
        })

    } catch (error) {
        console.log("User Dashboard Error",error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
})

module.exports=router;