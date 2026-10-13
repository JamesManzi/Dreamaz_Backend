const express=require("express");
const Product=require("../models/Product");

const {cloudinary,upload}=require("../cloudinary");

const router=express.Router();

router.delete("/deleteProduct/:id",async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not Found"
            })
        }

        if(product.files&&product.files.length>0){
            for(const file of product.files){
                if(product.public_id){
                    await cloudinary.uploader.destroy(
                        file.public_id,
                        {
                            resource_type:file.type
                        }
                    )
                }
            }
        }

        const deletedProduct=await Product.findByIdAndDelete(
            req.params.id,
            {
                new:true
            }
        );

        res.status(200).json({
            success:true,
            deletedProduct,
            message:"Product Deleted successfully"
        })
    } catch (error) {
        console.log("Deleting Product error",error);
        return res.status(500).json({
            success:false,
            message:"Deleting Product Error"
        })
    }
})

module.exports=router;