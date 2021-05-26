var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                  = require("./models/user");
    
mongoose.connect("mongodb://localhost/auth_task", { useNewUrlParser: true, useUnifiedTopology: true});//connecting our database
var app = express();                // starting our express in the varaible app
app.use(require("express-session")({
    secret : "This string is used to create the hash value for our password",
    resave: false,
    saveUninitialized: false
}));                            // express-session helps to maintain the session for a certain User
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));  // Used to get the paramaters value passed in the requests
app.use(passport.initialize());                     // express is initialized
app.use(passport.session());                        // express session is started
passport.use(new LocalStrategy(User.authenticate()));   // Local database strategy is used to authenticate
passport.serializeUser(User.serializeUser());       // adding current session User object in the cookie
passport.deserializeUser(User.deserializeUser());   // getting current session User object for the cookie

// -------------------
// Routes 
// -------------------

app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret",isLoggedIn, function(req, res){
    res.render("taskCompleted");
});

//-------------------
// Register Routes
//-------------------
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    User.register(new User({username : req.body.username}), req.body.password, function(err, user){
        if(err)
        {
            console.log(err);
            return res.render('login');
        }

        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

//-----------------
// Login Routes
//-----------------

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/register"
}),function(req, res){
});

//---------------
// Logout Routes
//---------------

app.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/");
});

//-------------
// Middleware
//--------------

function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
    {
        return next();
    }

    res.redirect("\login");
};
app.listen(3000);