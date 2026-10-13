const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const User=require("./models/User");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL)
.then(async()=>{
    const hash=await bcrypt.hash("AdminPassword123",10);

    const admin=await User.create({
        username: "System Adminstrator",
        email: "Admin@gmail.com",
        password:hash,
        role:"admin"
    });
    console.log("Admin Created",admin.username);
    process.exit();
})

.catch((err)=>{
    console.log("Create Admin Error",err);
    process.exit(1);
})