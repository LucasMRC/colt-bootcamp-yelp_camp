var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    middleware  = require('../middleware'),
    Comment = require("../models/comment");

// NEW COMMENT ROUTE

router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

// CREATE COMMENT ROUTE

router.post("/", middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           req.flash('error', 'Something went wrong');
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash('success', 'Successfully added comment');
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

// EDIT COMMENT ROUTE

router.get('/:comment/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment, function(err, foundComment) {
        if (err){
            res.redirect('back');
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE COMMENT ROUTE

router.put('/:comment', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back');
        } else {
            req.flash("success", "Comment updated");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY COMMENT ROUTE

router.delete('/:comment', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment, function(err){
       if (err) {
           console.log(err);
           res.redirect('back');
       } else {
           req.flash("success", "Comment deleted");
           res.redirect('/campgrounds/' + req.params.id);
       }
    });
});



module.exports = router;