const express=require("express");
const Product=require("../models/Product");
const { cloudinary,upload }=require("../cloudinary");

const router=express.Router();

router.post("/createProduct",upload.array("files"),async(req,res)=>{
    try {
        const {name,price,category,availability,description}=req.body;

        if(!name||!price||!category||!availability||!description){
            return res.status(400).json({
                success:false,
                message:"All Fields required"
            })
        }
        const files=req.files
        ?req.files.map((file)=>({
            url:file.path,
            type:file.mimetype.startsWith("image/")
            ?"image"
            :"video"
        })
        )
        :[];

        const createdProduct=await Product.create({
            name,
            price,
            category,
            availability,
            description,
            files
        })
        
        res.status(200).json({
            success:true,
            createdProduct,
            message:"Product Created Successfully"
        })
    } catch (error) {
        console.log("Creating Product Error",error);
        return res.status(500).json({
            success:false,
            message:"Creating Product Error"
        })
    }
})

module.exports=router;