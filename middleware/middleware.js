var User = require("../models/user");
var Place = require("../models/place");
var Rate = require("../models/rate");

//ALL THE MIDDLEWARE GOES HERE
var middleObj = {};

// Checks if the user already has the place
// saved in the user's database
middleObj.checkPlaceOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        User.findById(res.locals.user.id, function(err, currentUser) {
            if(err) {
                throw err;
            }
            else {
                for(var i = 0; i < currentUser.savedPlaces.length; i++) {
                    if(currentUser.savedPlaces[i] == req.params.id) {
                        res.redirect("/.");
                    }
                }
                next();
            }
        })
    } else {
        res.redirect("/.");
    }
}


// middleObj.alreadyRated = function(req, res, next) {
//     if(req.isAuthenticated()) {
//         Rate.findOne({ byUser: res.locals.user.id }, function(err, userRate) {
//             if(err) {
//                 throw err;
//             }
//             else {
//                 console.log(userRate);
//                 Place.findById(req.params.id, function(err, currentPlace) {
//                     if(err) {
//                         throw err;
//                         res.redirect("back");
//                     } else {
//                         for(var i = 0; i < currentPlace.ratings.length; i++) {
//                           console.log(userRate.id);
//                           console.log(currentPlace.ratings[i]);
//                             if(currentPlace.ratings[i] == userRate.id) {
//
//                                 res.redirect("/");
//                             }
//                         }
//                         next();
//                     }
//                 })
//             }
//         })
//     } else {
//         res.redirect("/.");
//     }
// }


//checks login status
middleObj.ensureAuthenticated = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}


module.exports = middleObj;
