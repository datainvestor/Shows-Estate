var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    LocalStrategy =require("passport-local"),
    methodOverride = require("method-override"),
    Place = require("./models/place"),
    Comment    = require("./models/comment"),
    User       = require("./models/user")
    //seedDB     = require("./seeds")
    
    
var commentRoutes     = require("./routes/comments"),
    placeRoutes  = require("./routes/places"),
    ratingRoutes     = require("./routes/ratings"),
    authRoutes        = require("./routes/index")
     
require('dotenv').config()
    
// seedDB()
mongoose.connect(process.env.DB)


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())

// require moment
app.locals.moment = require('moment');

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


//middleware that passes some vairable to every route
app.use(function(req, res, next){
    res.locals.currentUser=req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})


app.use(authRoutes)
app.use("/places", placeRoutes)
app.use("/places/:id/ratings", ratingRoutes);
app.use("/places/:id/comments", commentRoutes)



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Show estates Server Has Started!");
});