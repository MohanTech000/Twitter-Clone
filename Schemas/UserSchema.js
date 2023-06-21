const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    userName:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    Password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        default:"/images/profilePic.jpg"
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"postSchema",
    }],
    retweets:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"postSchema",
    }],
    following: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userSchema",
    }],
    followers: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userSchema",
    }],

},

{timestamps:true}

)

//create a collection
const userSchema = mongoose.model("userSchema", userModel);

module.exports = userSchema;