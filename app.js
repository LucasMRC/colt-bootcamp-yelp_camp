var bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    Campground      = require('./models/campground'),
    Comment         = require('./models/comment'),
    User            = require('./models/user'),
    methodOverride  = require('method-override'),
    seedDB          = require('./seeds'),
    flash           = require('connect-flash'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    commentRoutes   = require('./routes/comments'),
    campgroundRoutes= require('./routes/campgrounds'),
    indexRoutes     = require('./routes/index'),
    express         = require('express'),
    app             = express();

// APP CONFIG

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();

// PASSPORT CONF

app.use(require('express-session')({
    secret: 'Estoy con los papas de lukitas',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// CHECK LOGGED USER & ROUTES

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


// REQUIRING ROUTES

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/', indexRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Up & Running!!');
});