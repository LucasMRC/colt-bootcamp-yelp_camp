var bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    Campground      = require('./models/campground'),
    Comment         = require('./models/comment'),
    User            = require('./models/user'),
    methodOverride  = require('method-override'),
    seedDB          = require('./seeds'),
    flash           = require('connect-flash'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    MongoClient     = require('mongodb').MongoClient,
    assert          = require('assert'),
    commentRoutes   = require('./routes/comments'),
    campgroundRoutes= require('./routes/campgrounds'),
    indexRoutes     = require('./routes/index'),
    express         = require('express'),
    cookieParser    = require('cookie-parser'),
    app             = express();

// APP CONFIG
// seedDB();

// PASSPORT CONF

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.use(require('express-session')({
    secret: '<Estoy con los papas de lukitas>',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());



// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'yelp_camp';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});
//  ==========================================
//            Passport Configurations
//  ==========================================

passport.use(
    new LocalStrategy(function(username, password, done) {
            User.findOne({ username: username }).then(function(user) {
                if (!user || !user.authenticate(password)) {
                    return done(null, false, { message: 'Incorrect email or password.' });
                }

                done(null, user);
            });
        }
    )
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id })
        .then(function(user) {
            done(null, user);
        })
        .catch(function(err) {
            done(err, null);
        });
});
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