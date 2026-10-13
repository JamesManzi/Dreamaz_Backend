const express=require("express");
const Product=require("../models/Product");

const router=express.Router();

router.get("/productDetails/:id",async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not Found"
            })
        }

        res.status(200).json({
            success:true,
            product
        })
    } catch (error) {
        console.log("Getting Product Error",error);
        return res.status(500).json({
            success:false,
            message:"Getting Product Error"
        })
    }
})

module.exports=router;