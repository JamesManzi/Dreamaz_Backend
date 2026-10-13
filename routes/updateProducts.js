const express=require("express");
const Product=require("../models/Product");

const router=express.Router();

router.post("/updateProduct/:id",async(req,res)=>{
    try {
        const {name,price,category,availability,description}=req.body;

        const updatedData={};
        if(req.body.name){
            updatedData.name=name
        }
        if(req.body.price){
            updatedData.price=price
        }
        if(req.body.category){
            updatedData.category=category
        }
        if(req.body.availability){
            updatedData.availability=availability
        }

        if(req.body.description){
            updatedData.description=description
        }

        if(req.files){
            updatedData.files=req.files.map((file)=>({
                url:file.path,
                type:file.mimetype.startsWith("image/")
                ?"image"
                :"video"
            }))
        }

        const UpdatedProduct=await Product.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {
                new:true
            }
        )

        if(!UpdatedProduct){
            res.status(404).json({
                success:false,
                message:"Product not Found"
            })
        }
        res.status(200).json({
            success:true,
            UpdatedProduct,
            message:"Product Updated successfully"
        })
    } catch (error) {
        console.log("updating Product Error",error);
        return res.status(500).json({
            success:false,
            message:"Updating Product Error"
        })
    }
})

module.exports=router;