const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser"); //used for getting data from body
const userSchema = require("../Schemas/UserSchema");

app.set("view engine", "pug"),
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

 
router.get("/", (req, res, next) => {

    let payLoad = {
        pageTitle: req.session.user.userName,
        userLoggedIn : req.session.user,
        userLoggedInJs : JSON.stringify(req.session.user), //for client
        profileUser : req.session.user

    }

    res.status(200).render("profilePage", payLoad);
});

router.get("/:userName", async(req, res, next) => {

  let payLoad = await getPayLoad(req.params.userName, req.session.user);
  res.status(200).render("profilePage", payLoad);

});

router.get("/:userName/replies", async(req, res, next) => {

  let payLoad = await getPayLoad(req.params.userName, req.session.user);
  payLoad.selectedTab = "replies";
  res.status(200).render("profilePage", payLoad);

})

getPayLoad = async (userName, userLoggedIn) => {
    let user = await userSchema.findOne({ userName: userName });
  
    if (user == null) {
      user = await userSchema.findById(userName);
      
      if (user == null) {
        return {
          pageTitle: "User Not Found",
          userLoggedIn: userLoggedIn,
          userLoggedInJs: JSON.stringify(userLoggedIn),
        }
      }
    }
  
    return {
      pageTitle: user.userName,
      userLoggedIn: userLoggedIn,
      userLoggedInJs: JSON.stringify(userLoggedIn),
      profileUser: user,
    }
  };
  

module.exports = router;