const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

//MongoDB conn
require("../src/connection/conn");


//Middleware
const middleWare = require("../src/MiddleWare/middleWare");
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));


//session (for security)
app.use(session({
    secret: "B dev",
    resave: true,
    saveUninitialized: false
}))


app.set("view engine", "pug"),
app.set("views", "views");

//static files
app.use(express.static(path.join(__dirname, "public"))); 


//Routes
const loginRoute = require("../src/Routes/login_Routes");
const logoutRoute = require("../src/Routes/logout_Routes");
const registerRoute = require("../src/Routes/register_Routes");
const postRoute = require("../src/Routes/postRoutes");
const profileRoute = require("../src/Routes/profileRoutes");

//API Routes
const postApiRoute = require("../src/Routes/api/posts");


app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/register", registerRoute);
app.use("/post", middleWare.requireLogin, postRoute);
app.use("/profile/", middleWare.requireLogin, profileRoute);

app.use("/api/posts", postApiRoute);
    


    


app.get("/", middleWare.requireLogin, (req, res, next) => {

    let payLoad = {
        pageTitle:"Twitter Clone Project",
        userLoggedIn : req.session.user,
        userLoggedInJs : JSON.stringify(req.session.user) //for client

    }

    res.status(200).render("home", payLoad);
});




//Server Connection
app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
})