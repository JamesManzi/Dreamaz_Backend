const mongoose=require("mongoose");

const trendingSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String
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

module.exports=mongoose.model("Trending",trendingSchema);