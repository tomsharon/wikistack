var express = require("express")
var models = require("../models/");
var Promise = require('bluebird');


var router = express.Router();


var Page = models.Page;
var User = models.User;



router.get("/", function(req, res, next) {
	User.find({}).exec()
	// console.log("Made it this far!!!!!!")
		.then(function(allUsers){
			console.log("these are all the users!!!!!!", allUsers)
			res.render("userlist", {"users": allUsers})

			// res.send("hello")
			// res.render("index")
		})
		.then(null, next)
})

// router.get("/:id", function(req, res, next) {
// 	var userID = req.params.id;
// 	Page.find({"author": userID}).exec()
// 		.then(function(foundPages) {
// 			res.render("userpage", {"pages": foundPages})
// 		})
// 		.then(null, next)
// })

router.get("/:id", function(req, res, next) {
	var userID = req.params.id;
	var userPromise = User.findById(userID).exec()
	var pagePromise = Page.find({"author": userID}).exec()
	Promise.join(userPromise, pagePromise, function(user, pages) {
		res.render("userpage", {user: user, pages: pages})
	})
	.then(null, next)
})


// router.get('/:id', function(req, res, next){
//   var userPromise = User.findById(req.params.id).exec();
//   var pagesPromise = Page.find({ author: req.params.id }).exec();
//   Promise.join(userPromise, pagesPromise, function(user, pages){
//     res.render('user', { user: user, pages: pages });
//   }).catch(next);
// });



module.exports = router;

