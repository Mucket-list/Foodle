var express = require('express');
var router = express.Router({mergeParams: true});
var Place = require('../models/place');
var User = require('../models/user');
//var middleware = require("../middleware/middleware");

//Main category page
router.get("/", function(req, res) {
    res.render("categories/category");
})



module.exports = router;
