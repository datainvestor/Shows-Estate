var express = require("express");
var router  = express.Router({mergeParams: true});
var Place = require("../models/place");
var Rating = require("../models/ratings");
var middleware = require("../middleware");

router.post('/', middleware.isLoggedIn, middleware.checkRatingExists, function(req, res) {
	Place.findById(req.params.id, function(err, place) {
		if(err) {
			console.log(err);
		} else if (req.body.rating) {
				Rating.create(req.body.rating, function(err, rating) {
				  if(err) {
				    console.log(err);
				  }
				  rating.author.id = req.user._id;
				  rating.author.username = req.user.username;
				  rating.save();
					place.ratings.push(rating);
					place.save();
					req.flash("success", "Successfully added rating");
				});
		} else {
				req.flash("error", "Please select a rating");
		}
		res.redirect('/place/' + place._id);
	});
});

module.exports = router;