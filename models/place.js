var mongoose = require("mongoose");

/*
    idplace
    name
    type
    location
    gps
    description
    saved
    picsurl
    picsurl2
    picsurl3
*/

//SCHEMA SETUP
var placeSchema = new mongoose.Schema({
    name: String,
    type: String,
    location: String,
    gps: String,
    description: String,
    saved: {
      type: Number
    },
    picurl1: String,
    picurl2: String,
    picurl3: String
});

//compile above into a model
module.exports = mongoose.model("Place", placeSchema);
