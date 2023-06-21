const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser"); //used for getting data from body
const userSchema = require("../Schemas/UserSchema");
const bcrypt = require("bcrypt");





app.set("view engine", "pug"),
    app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));


router.get("/:id", (req, res, next) => {

    let payLoad = {
        pageTitle:"View post",
        userLoggedIn : req.session.user,
        userLoggedInJs : JSON.stringify(req.session.user), //for client
        postId: req.params.id

    }

    res.status(200).render("postPage", payLoad);
});

module.exports = router;