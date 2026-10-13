const mongoose=require("mongoose");

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    category:{
        type:String,
        required:true,
    },
    availability:{
        type:String,
        enum:["available","sold","reserved"],
        default:"available"
    },
    description:{
        type:String,
        trim:true
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

module.exports=mongoose.model("Product",productSchema);

