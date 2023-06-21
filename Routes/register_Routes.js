const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const userSchema = require("../Schemas/UserSchema");
const bcrypt = require("bcrypt");

app.set("view engine", "pug"),
app.set("views", "views");

//MiddleWare
app.use(bodyParser.urlencoded({extended:false}));


router.get("/", (req, res, next) => {

    res.status(200).render("register");
});

router.post("/", async(req, res, next) => {

    // console.log(req.body);
    //if you want only username then; similarly for all others:
    // console.log(req.body.username); <== like this one

    let firstName = req.body.firstName.trim();
    let lastName = req.body.lastName.trim();
    let userName = req.body.userName.trim();
    let email = req.body.email.trim();
    let Password = req.body.Password;


    let payLoad = req.body;

    if(firstName && lastName && userName && email && Password){

      const user = await userSchema.findOne({
            $or:[
                {userName:userName},
                {email:email}
            ]
        }).catch((error)=>{
            console.error(error);
            payLoad.errorMessage = "Something went wrong";
            res.status(200).render("register", payLoad);
        });


        //checking if username and email are already in use

        if(user == null){
            //user not found

            let data = req.body;

            data.Password = await bcrypt.hash(Password, 10);

            userSchema.create(data)
            .then((user)=>{
                req.session.user = user
                return res.redirect("/");
                // console.log(user);
            })



        }else{
            //user found
            if(email == user.email){
                payLoad.errorMessage = "Email already in use";
            }else{
                payLoad.errorMessage = "username already in use"
            }
            res.status(200).render("register", payLoad);


        }





    }
    else{
       payLoad.errorMessage = "Make sure that each field has a valid value";
        res.status(200).render("register", payLoad);
    }

    // res.status(200).render("register");
});


module.exports = router;