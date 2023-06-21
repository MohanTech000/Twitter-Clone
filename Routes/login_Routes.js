const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser"); //used for getting data from body
const userSchema = require("../Schemas/UserSchema");
const bcrypt = require("bcrypt");





app.set("view engine", "pug"),
    app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));


router.get("/", (req, res, next) => {

    res.status(200).render("login");
});


router.post("/", async (req, res, next) => {

    let payLoad = req.body;

    if (req.body.logUser && req.body.logPass) {
        const user = await userSchema.findOne({
            $or: [
                { userName: req.body.logUser },
                { email: req.body.logUser}
            ]
        }).catch((error) => {
            console.error(error);
            payLoad.errorMessage = "Something went wrong";
            res.status(200).render("login", payLoad);
        });

        if (user !== null) {
            let result = await bcrypt.compare(req.body.logPass, user.Password);
            if (result === true) {  //=== these three signs used for checking;
                req.session.user = user
                return res.redirect("/");
            }

        }


        payLoad.errorMessage = "Login credentials incorrect"
        return res.status(200).render("login", payLoad);



    }

    payLoad.errorMessage = "Make sure each field has a valid value";
    res.status(200).render("login");
});

module.exports = router;