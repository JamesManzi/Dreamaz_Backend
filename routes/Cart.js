const express=require("express");
const Cart=require("../models/Cart");
const Product=require("../models/Product");
const router=express.Router();

router.post("/addCart",async(req,res)=>{
    try {
        const {quantity}=req.body;
        const productId=await Product.findById(req.params.id);
        const product=await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product Not Found"
            });
        }
        if(quantity<=0||!Number.isInteger(quantity)){
            return res.status(400).json({
                success:false,
                message:"Invalid Quantity"
            })
        }
        const buyerId=req.userId;
        if(!buyerId){
            return res.status(400).json({
                success:false,
                message:"User Not Found"
            })
        };
        let cart=await Cart.findOne({buyer:buyerId});

        if(!cart){
            cart=await Cart.create({
                buyer:buyerId,
                item:[]
            })
        };
        const existingItem=await cart.items.find(item=>item.product.toString()==productId);
        if(existingItem){
            existingItem.quantity+=quantity;
        } else{
            cart.items.push({
                product:productId,
                quantity
            })
        };

        await Cart.save();
        res.status(201).json({
            success:true,
            cart,
            message:"Product Added to Cart successfully"
        })
    } catch (error) {
        console.log("Adding To Cart Error",error);
        return res.status(500).json({
            success:false,
            message:"Adding to Cart Error"
        })
    }
})

module.exports=router;