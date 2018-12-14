var mongoose = require("mongoose");


var rateSchema = new mongoose.Schema({
    rate: Number,
    byUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var Rate = module.exports = mongoose.model("Rate", rateSchema);
