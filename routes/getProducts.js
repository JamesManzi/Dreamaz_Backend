const express=require("express");
const Product=require("../models/Product");

const router=express.Router();

router.get("/getProducts",async(req,res)=>{
    try {
        const products=await Product.find();
        const totalProducts=await Product.countDocuments();
         const availableProducts=await Product.countDocuments({
                    availability:"available"
                });
                const soldProducts=await Product.countDocuments({
                    availability:"sold"
                });
                const reservedProducts=await Product.countDocuments({
                    availability:"reserved"
                });
        if(!products){
            return res.status(404).json({
                success:false,
                message:"Products not Found"
            })
        }
        res.status(200).json({
            success:true,
            products,
            totalProducts,
            availableProducts,
            soldProducts,
            reservedProducts,
        })
    } catch (error) {
        console.log("Fetching Product Error",error);
        return res.status(500).json({
            success:false,
            message:"Fetching Products Error"
        })
    }
})

module.exports=router;