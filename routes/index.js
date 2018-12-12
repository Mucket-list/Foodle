var express = require('express');
var router = express.Router();
var Place = require('../models/place');

// Get Homepage
router.get('/', function(req, res){
	Place.find({type: "restaurant"}, function(err, allRestaurants) {
			if(err) throw err;
			else {
					Place.find({type: "cafe"}, function(err, allCafes) {
							if(err) throw err;
							else {
									Place.find({type: "bar"}, function(err, allBars) {
											if(err) throw err
											else {
													res.render('index', {
														currentUser: res.locals.user,
														placeid: "5c0ee49fb734739ff0d1b212",
														restaurants: allRestaurants,
														cafes: allCafes,
														bars: allBars
													});
											}
									})
							}
					})
			}
	})
});


module.exports = router;
