const mongoose=require("mongoose");

const contentSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    artist:{
        type:String,
        required:true
    },
    files:[
        {
            url:{
                type:String
            },
            type:{
                type:String,
                enum:["image","video"]
            },
            public_id:{
                type:String
            }
        }
    ],
},{
    timestamps:true
})

module.exports=mongoose.model("Content",contentSchema);