const cors=require("cors");

const allowed_origins=process.env.ALLOWED_ORIGINS
?process.env.ALLOWED_ORIGINS.split(",").map(origin=>origin.trim())
:["http://localhost:5173"];

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