var express     = require('express'),
    Campground  = require('../models/campground'),
    middleware  = require('../middleware'),
    router      = express.Router();

router.get('/', function(req, res){
        Campground.find({}, function(err, camps){
            if (err) {
                console.log(err);
            } else {
                res.render('campgrounds/index', {campgrounds:camps});
            }
        });
});

// NEW CAMPGROUND ROUTE

router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});

// CREATE CAMPGROUND ROUTE

router.post('/', middleware.isLoggedIn, function(req, res){
    var name = req.body.name,
        image = req.body.image,
        desc = req.body.description,
        author = {
        id: req.user._id,
        username: req.user.username
    },
        price = req.body.price;
    var newCampground = {name: name, image: image, description: desc, author: author, price: price};
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) {
            console.log('Error!');
        } else {
            req.flash('success', "New campground successfully created");
            res.redirect('/campgrounds');
        }
    });
});

// SHOW ROUTE

router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if (err) {
            console.log('Error!!!!');
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE

router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit',  {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE

router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err) {
            console.log(err);
        } else {
            req.flash('success', "Campground successfully updated");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DELETE CAMPGROUND ROUTE

router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if (err) {
            res.redirect('/campgrounds');
        } else {
            req.flash('success', "Campground successfully deleted");
            res.redirect('/campgrounds');
        }
   });
});



module.exports = router;