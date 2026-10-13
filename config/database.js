const mongoose=require("mongoose");
require("dotenv").config();

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database Connection error",error.message);
        process.exit(1);
    }
}

module.exports=connectDB;