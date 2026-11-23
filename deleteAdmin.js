const express=require("express");
const User=require("./models/User");
const mongoose=require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    const deleteAdmin=async()=>{
    try {
        const user=await User.findOne({email:"Admin@gmail.com"});
        if(!user){
            console.log("Admin Not Found");
        }
        await User.findOneAndDelete(user._id);
        console.log("User Deleted Successfully");
    } catch (error) {
        console.log("Deleting Admin Error",error);
    }
}
deleteAdmin();
})

.catch(()=>{
    console.log("Database Error",error);
    process.exit();
})
