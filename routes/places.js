var express = require("express")
var router = express.Router()
var Place = require("../models/place")
var middleware=require("../middleware")



//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Place.find({}, function(err, allPlaces){
        if(err){
            console.log(err)
        } else{
            res.render("places/index",{places: allPlaces})
        }
        
    })
});


//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price= req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPlace = {name: name, price:price, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    Place.create(newPlace, function(err, newlyCreated){
        if (err){
            console.log(err)
        } else {
             //redirect back to campgrounds page
            res.redirect("/places")
        }
        
    })
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("places/new"); 
});


// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Place.findById(req.params.id).populate("comments").populate("ratings").exec(function(err, foundPlace){
        if(err){
            console.log(err);
        } else {
            if(foundPlace.ratings.length > 0) {
              var ratings = [];
              var length = foundPlace.ratings.length;
              foundPlace.ratings.forEach(function(rating) { 
                ratings.push(rating.rating) 
              });
              var rating = ratings.reduce(function(total, element) {
                return total + element;
              });
              foundPlace.rating = rating / length;
              foundPlace.save();
            }
            console.log("Ratings:", foundPlace.ratings);
            console.log("Rating:", foundPlace.rating);
            //render show template with that campground
            res.render("places/show", {place: foundPlace});
        }
    });
});


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkPlaceOwnership, function(req, res) {
    Place.findById(req.params.id, function(err, foundPlace){
        if(err){
            req.flash("error", "Place not found")
            res.redirect("/places")
        } else{
             res.render("places/edit", {place: foundPlace})
        }
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkPlaceOwnership, function(req, res){
    // find and update the correct campground
    Place.findByIdAndUpdate(req.params.id,  req.body.place, function(err, updatedPlace){
        if(err){
            res.redirect("/places")
        } else {
            //redirect somewhere(show page)
            res.redirect("/places/" + req.params.id)
        }
    })
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkPlaceOwnership, function(req, res){
    Place.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/places")
        } else {
            res.redirect("/places")
        }
    })
})




module.exports = router;