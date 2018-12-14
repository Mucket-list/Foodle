var express = require('express');
var router = express.Router({mergeParams: true});
var Place = require('../models/place');
var User = require('../models/user');
//var middleware = require("../middleware/middleware");

//Main category page
router.get("/:type", function(req, res) {
    var catType = req.params.type.substring(0, req.params.type.length - 1);
    Place.find({type: catType}, function(err, allPlaces) {
        if(err) throw err;
        else {
              res.render('categories/category', {
                allPlaces: allPlaces,
                currentUser: res.locals.user
              });
        }
    });
});




module.exports = router;
