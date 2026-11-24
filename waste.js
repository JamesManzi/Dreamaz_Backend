const cors=require("cors");

const allowed_origins=process.env.ALLOWED_ORIGINS
?process.env.ALLOWED_ORIGINS.split(",").map(origin=>origin.trim())
:["https://dreamaz-project-yr6w-dun.vercel.app",
        "http://localhost:5173",
        "https://dreamaz-project-yr6w-l1i04phrz-carlos078754s-projects.vercel.app"]

const corsOptions={
    origin:function(origin,callback){
            if(!origin){
                return callback(null,true);
            };
            if(allowed_origins.includes(origin)){
                return callback(null,true);
            }
    
            console.log("Blocked origin",origin);
    
            return callback(new Error("Blocked by Cors"))
            
        },
    
        methods:['GET','POST','PUT','DELETE','OPTIONS'],
        allowedHeaders:['Content-Type','Authorization'],
        credentials:true
}

module.exports=cors(corsOptions);



const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const compare = await bcrypt.compare(password, user.password);

        if (!compare) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            success: true,
            message: "Login Successfully",
            token,
            user: {
                username: user.username,
                id: user._id,
                email: user.email,
                role:user.role
            }
        });

    } catch (error) {
        console.log("Login Error", error);

        return res.status(500).json({
            success: false,
            message: "Login Server Error"
        });
    }
});

module.exports = router;
