var express         = require("express");
var router          = express.Router();
var User            = require("../models/user");
var nodemailer      = require('nodemailer');
var middleware      = require("../middleware/middleware");
var Place           = require("../models/place");

//show profile of the user
router.get("/",middleware.ensureAuthenticated, function(req, res){
    //find username with provided id
    User.findById(res.locals.user._id, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else {
            var placeInList;
            var mukList = [];
            Place.find({}, function(err, allPlaces) {
                if(err) throw err;
                else {
                    for(var i = 0; i < foundUser.savedPlaces.length; i++) {
                        allPlaces.forEach(function(place) {
                            if(foundUser.savedPlaces[i] == place.id) {
                                mukList.push(place);
                            }
                        });
                    }

                    //render show tamplate with that user id
                    //with foundUser as user parameter
                    res.render("profiles/profile", {currentUser: res.locals.user, favorites: mukList});
                }

            })
            // for(var i = 0; i < foundUser.savedPlaces.length; i++){
            //     // Place.find(foundUser.savedPlaces[i], function(err, foundPlace) {
            //     //     if(err) throw err;
            //     //     else {
            //     //         mukList.save(foundPlace);
            //     //     }
            //     // });
            // }

       }
   });

});

router.post("/", middleware.ensureAuthenticated, function(req, res) {

    const output = `
      <p>You have a new location add request</p>
      <h3>Contact Details</h3>
      <ul>
        <li>Name: ${req.body.name}</li>
        <li>Type: ${req.body.restaurant}</li>
        <li>Type: ${req.body.address}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.extra}</p>
    `;

      // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        secure: true,
        service: 'Gmail',
        auth: {
            user: "foodle307Pro@gmail.com", // generated ethereal user
            pass: "Comp307@#!"  // generated ethereal password
        }
        // tls:{
        //   rejectUnauthorized:false
        // }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: res.locals.user.email, // sender address
        to: 'sang.m.lee@mail.mcgill.ca', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'You have a new location request', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(err) {
        if(err)
            throw err;
        console.log("email sent")
        res.redirect("back");
  });
});



module.exports = router;
