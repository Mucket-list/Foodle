var express = require('express');
var router = express.Router({mergeParams: true});
var Place = require('../models/place');
var User = require('../models/user');
var middleware = require("../middleware/middleware");

// Get Homepage
router.get('/', function(req, res){
	Place.findById(req.params.id, function(err, foundPlace) {
		if(err) throw err;
		else {
			res.render('places/place', {currentUser: res.locals.user, foundPlace: foundPlace});
		}
	})
});

router.post('/', middleware.checkPlaceOwnership, function(req, res) {
		User.findById(res.locals.user.id, function(err, foundUser) {
				if(err) throw err;
				else {
						//console.log(req);
						Place.findById(req.params.id, function(err, place) {
								if(err) throw err;
								else {
										var saves = place.saved + 1;
										var newValue = {$set: {saved: saves}};
										Place.findByIdAndUpdate(place._id, newValue, function(err) {
												if(err) throw err;
										});

										foundUser.savedPlaces.push(place);
										foundUser.save();
										res.redirect("/");
								}
						});
				}
		})
});


// remove restaurant from favorites
router.post("/delete", middleware.ensureAuthenticated, function(req, res) {
		User.findById(res.locals.user.id, function(err, currentUser) {
				if(err) throw err;
				else {
						var places = currentUser.savedPlaces;
						for(var i = 0; i < places.length; i++) {
								if(places[i] == req.params.id) {
										places.splice(i, 1);
										break;
								}
						}

						Place.findById(req.params.id, function(err, place) {
								if(err) throw err;
								else {
										var saves = place.saved - 1;
										var newValue = {$set: {saved: saves}};
										Place.findByIdAndUpdate(place._id, newValue, function(err) {
												if(err) throw err;
										});

										// currentUser.savedPlaces.push(places);
										currentUser.save();
										res.redirect("back");
								}
						});
				}
		})
});




module.exports = router;
