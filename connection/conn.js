const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/Twitter-Clone",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("MongoDB conn successfull");
}).catch((e)=>[
    console.error(e)
]);