const User=require("../models/User");
const express=require("express");

const router=express.Router();


router.delete("/users/:id",async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(201).json({
            success:true,
            message:"User Deleted Successfully"
        })
    } catch(error){
        console.log("Deleting Admin Error",error);
        return res.status(500).json({
            success:false,
            message:"Deleting Users Error"
        })
    }
})

module.exports=router;