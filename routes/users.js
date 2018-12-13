var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer		= require("nodemailer");
var bcrypt			= require("bcryptjs");

var User = require('../models/user');

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// Register User
router.post('/register', function (req, res) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var password = req.body.password;
	var password = req.body.password2;

	// Validation
	// req.checkBody('name', 'Name is required').notEmpty();
	// req.checkBody('email', 'Email is required').notEmpty();
	// req.checkBody('email', 'Email is not valid').isEmail();
	// req.checkBody('username', 'Username is required').notEmpty();
	// req.checkBody('password', 'Password is required').notEmpty();
	// req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking if email is already taken
			User.findOne({ email: {
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (mail) {
					res.render('register', {
						mail: mail
					});
				}
				else {
					var newUser = new User({
						firstname: firstname,
						lastname: lastname,
						email: email,
						password: password
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
					});
         	req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/');
				}
			});
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Invalid username or password' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid username or password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/.');
	});

router.get('/reset', function(req, res) {
		res.render("passEmail");
})

router.post('/reset', function(req, res) {
		var userMail = req.body.email;

		const output = `
			<p>Password Reset Form</p>
			<h3>Click the link below to reset your password</h3>
			<a href="https://pacific-refuge-27092.herokuapp.com">reset your password</a>
		`;

			// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
				// host: 'mail.YOURDOMAIN.com',
				// port: 587,
				// secure: false, // true for 465, false for other ports
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
				from: "foodle307Pro@gmail.com", // sender address
				to: userMail, // list of receivers
				subject: 'Password Reset Request', // Subject line
				text: 'Reset your password from the link below', // plain text body
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


router.get('/reset/password', function(req, res) {
		res.render("reset");
});

router.post('/reset/password', function(req, res) {
		let emailR = req.body.email;
		let passwordR = req.body.password;
		// let passwordCR = req.body.password2;

		User.findOne({email: emailR}, function(err, foundUser) {
				bcrypt.genSalt(10, function(err, salt) {
						if(err) throw err;
						bcrypt.hash(passwordR, salt, function(err, hash) {
								if(err) throw err;
								var passwordRefresh = {$set: {password: hash}};
								User.findByIdAndUpdate(foundUser._id, passwordRefresh, function(err) {
										if(err) throw err;
										else {
												console.log(hash);
										}
								});
								req.flash("success_msg", "Password Successfully Changed");
								res.redirect("/");
						});
				});
	  });
})


router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/');
});

module.exports = router;
