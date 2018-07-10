var Place = require("../models/place")
var Rating = require("../models/ratings");
var Comment = require("../models/comment")

// all the middleware goes here
var middlewareObj = {}



middlewareObj.checkPlaceOwnership= function(req, res, next){
    if(req.isAuthenticated()){
        Place.findById(req.params.id, function(err, foundPlace){
           if(err || !foundPlace){
               req.flash("error", "Place not found")
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundPlace.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "You have no permission to do that")
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash("error", "Comment not found")
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "You have no permission to do that")
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.")
        res.redirect("back");
    }
}

middlewareObj.checkRatingExists = function(req, res, next){
  Place.findById(req.params.id).populate("ratings").exec(function(err, place){
    if(err){
      console.log(err);
    }
    for(var i = 0; i < place.ratings.length; i++ ) {
      if(place.ratings[i].author.id.equals(req.user._id)) {
        req.flash("success", "You already rated this!");
        return res.redirect('/places/' + place._id);
      }
    }
    next();
  })
}

middlewareObj.isLoggedIn= function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error", "You need to be logged in to do that.")
    res.redirect("/login")
}


middlewareObj.isSafe= function(req, res, next) {
    if(req.user.isAdmin || req.body.place.image.match(/^https:\/\/images\.unsplash\.com\/.*/)) {
      next();
    }else {
      req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
      res.redirect('back');
    }
}

module.exports=middlewareObj

