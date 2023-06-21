const mongoose = require("mongoose");

const postModel = new mongoose.Schema({
    content:{
        type:String,
        trim:true
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userSchema",
        pinned:Boolean
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userSchema",
    }],
    retweetUsers:[{ //means that how many users retweet this post;
        type:mongoose.Schema.Types.ObjectId,
        ref:"userSchema",
    }],
    retweetData:{ //Its just the id of the post that we retweeting
        type:mongoose.Schema.Types.ObjectId,
        ref:"postSchema",
    },
    replyTo:{ //Its just the id of the post that we retweeting
        type:mongoose.Schema.Types.ObjectId,
        ref:"postSchema",
    }
},

{timestamps:true}

)

//create a collection
const postSchema = mongoose.model("postSchema", postModel);

module.exports = postSchema;