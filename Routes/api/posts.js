const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser"); //used for getting data from body
const userSchema = require("../../Schemas/UserSchema");
const postSchema = require("../../Schemas/PostSchema");


app.use(bodyParser.urlencoded({ extended: false }));


router.get("/", async(req, res, next) => {

    let searchObj  = req.query;

    if(searchObj.isReply !== undefined) {

        
        let isReply = searchObj.isReply == "true";
        searchObj.replyTo = { $exists: isReply } //whether this $exists field returns that this line(field) is exists or not.
        delete searchObj.isReply; //deleting isReply field
        console.log(searchObj); 
    }
      

    let results = await getPosts(searchObj);
    res.status(200).send(results)

});

// router.get("/:id", (req, res, next) => {

//     postSchema.find()
//     .populate("postedBy")
//     .populate("retweetData")
//     .sort({"createdAt": -1}) //shows latest posts
//     .then(async results => {
//         results = await userSchema.populate(results, { path: "retweetData.postedBy"});
//         res.status(200).send(results);
//     }).catch(error => {
//         console.log(error)
//         res.status(500).send(error);
//     })

// });

router.get("/:id", async(req, res, next) => {

    let postId = req.params.id;

    let postData = await getPosts({_id: postId});
    postData = postData[0];
    // console.log(results);

    let results = {
        postData: postData
    }

    if(postData.replyTo !== undefined) {
        results.replyTo = postData.replyTo;
    }

    results.replies = await getPosts({replyTo: postId})

    res.status(200).send(results);


});



router.post("/", async (req, res, next) => {

    if (!req.body.content) {
        console.log("bad request");
        return res.sendStatus(400);
    }

 

    let postData = {
        content: req.body.content,
        postedBy: req.session.user
    }

    if(req.body.replyTo) {
        postData.replyTo = req.body.replyTo;
    }

    postSchema.create(postData)
        .then(async newPosts => {
            newPosts = await postSchema.populate(newPosts, { path: "postedBy" });
            res.status(201).send(newPosts);
            console.log(newPosts);


        }).catch(e => {
            console.error(e);
        })





});

router.put("/:id/like", async (req, res, next) => {

    let postId = req.params.id; 
    let userId = req.session.user._id;

    //checking if already liked a post or not
    let isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
    let option =  isLiked ? "$pull" : "$addToSet"; //condition

    

    // console.log("is liked: " + isLiked);
    // console.log("option: " + option);
    // console.log("userId: " + userId);

    //Insert user Likes/unlikes:
    req.session.user = await userSchema.findByIdAndUpdate(userId, { [option] : {likes: postId} }, {new: true}) //$addToSet is mongoDB operator used to set values
    .catch(error => {
        console.log(error);
        res.status(400);
    });

    // if we want to unlike post we just use $pull method;



    //Insert post like: 
    let post = await postSchema.findByIdAndUpdate(postId, { [option] : {likes: userId} }, {new: true}) //$addToSet is mongoDB operator used to set values
    .catch(error => {
        console.log(error);
        res.status(400);
    });

    res.status(200).send(post);



});

router.post("/:id/retweet", async (req, res, next) => {

    let postId = req.params.id; 
    let userId = req.session.user._id;

    //try and delete retweet
    let deletedPost = await postSchema.findOneAndDelete({postedBy: userId, retweetData: postId})
    .catch(error => {
        console.log(error);
        res.status(400);
    });

    let option =  deletedPost !== null ? "$pull" : "$addToSet"; //condition

    let rePost = deletedPost;

    if(rePost == null) {
        rePost = await postSchema.create({postedBy: userId, retweetData: postId})
        .catch(console.error());
    }


    //retweeting post:
    req.session.user = await userSchema.findByIdAndUpdate(userId, { [option] : {retweets: rePost._id} }, {new: true}) //$addToSet is mongoDB operator used to set values
    .catch(error => {
        console.log(error);
        res.status(400);
    });

    //Insert retweets: 
    let post = await postSchema.findByIdAndUpdate(postId, { [option] : {retweetUsers: userId} }, {new: true}) //$addToSet is mongoDB operator used to set values
    .catch(error => {
        console.log(error);
        res.status(400);
    });

    res.status(200).send(post);



});

router.delete("/:id", (req, res, next) => {

    postSchema.findByIdAndDelete(req.params.id)
    .then(() => res.sendStatus(202))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    });

})

//function for getting posts for reply modal
getPosts = async(filter) => {
    let results = await postSchema.find(filter)
    .populate("postedBy")
    .populate("retweetData")
    .populate("replyTo")
    .sort({"createdAt": -1}) //shows latest posts
    .catch(error => {
        console.log(error);
    })

    results = await userSchema.populate(results, { path: "replyTo.postedBy"});
    return await userSchema.populate(results, { path: "retweetData.postedBy"});

}

module.exports = router;