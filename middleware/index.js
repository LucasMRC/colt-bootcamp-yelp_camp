var Campground      = require('../models/campground'),
    Comment         = require('../models/comment'),
    middlewareObj   = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
    if (!req.isAuthenticated()){
        req.flash('error', 'You need to be logged in to do that!')
        res.redirect('back');
        return;
    } else {
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                req.flash('error', 'Campground not found');
                res.redirect('back');
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You don\'t have permission to do that');
                    res.redirect('back');
                }
            }
        });
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next){
    if (!req.isAuthenticated()){
        req.flash('error', 'You need to be logged in to do that!')
        res.redirect('back');
    } else {
        Comment.findById(req.params.comment, function(err, foundComment){
            if (err) {
                req.flash('error', 'Comment not found');
                res.redirect('back');
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You don\'t have permission to do that');
                    res.redirect('back');
                }
            }
        });
    }
};


middlewareObj.isLoggedIn =  function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to be logged in to do that!');
    res.redirect("/login");
};



module.exports = middlewareObj;