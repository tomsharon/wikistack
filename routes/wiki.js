var express = require("express");
var models = require("../models/");

//Instantiating Router instance:
var router = express.Router();

//Getting our Page and User models, from index.js:
var Page = models.Page;
var User = models.User;




//router is assuming all paths start with "/wiki" 
//since we tell it to in app.js:



router.get("/", function(req, res, next) {
	//retrieve all wiki pages
	//display list of links to all wiki pages

	// res.redirect("/");

	Page.find({}).exec()
		.then(function(arrayOfFoundPages){
			res.render("index", {"pages": arrayOfFoundPages})
		})
		.then(null, next)

})



router.get("/add", function(req, res, next) {
	//retrieve the "add a page" form
	res.render("addpage");
})



router.get("/search", function(req, res, next) {
	var tagToSearch = req.query.search;

	Page.findByTag(tagToSearch)
		.then(function(arrayOfFoundPagesWithThatTag){
			res.render("index", {"pages": arrayOfFoundPagesWithThatTag})
		})
		.then(null, next)
})


router.post("/", function(req, res, next) {
	//submit new page to the database

	//Create a new page instance / document:
	var page = new Page({
		title: req.body.title,
		content: req.body.pageContent,
		status: req.body.status,
		tags: req.body.tags.split(" ")
		// urlTitle: models.generateUrlTitle(req.body.title)

		//Note that req.body contains the input for each field on
		//add page. 
	})

	User.findOrCreate({authorName: req.body.authorName, authorEmail: req.body.authorEmail})
		.then(function(user){
			page.author = user._id;
			return page.save();
		})
		.then(function(savedPage){
			// res.json(savedPage);
			// console.log("THIS IS SAVEDPAGE", savedPage)
			res.redirect(savedPage.route)
		})
		.then(null, next)


	//Save Page and redirect home (validation occurs before save):
	//By the way, within the save function, we also validate. Meaning that before validation occurs we will generate the proper urlTitle thanks to our pre-validate hook.


	//To be clear, new documents are never saved to the db without 
	//having a urlTitle based on the title
	// page.save()
	// .then(
	// 	function(savedPage){
	// 		// res.json(savedPage);
	// 		res.redirect(savedPage.route)
	// 	})
	// .then(null, next)
})


//Get to a specific page: 
//Note--we must put this after add, 
//otherwise we'll never be able to get to "/add", 
//since "/:pagename" will grab whatever comes after the first slash, 
//whether it's "add" or anything else
router.get("/:pageName", function(req, res, next) {
	var urlTitle = req.params.pageName

	Page.findOne({"urlTitle": urlTitle}).exec()
		.then(function(foundPage){
				// res.json(foundPage);
				res.render("wikipage", {"Page": foundPage});
			})
		.then(null, next);


	// res.send("hit a dynamic route at " + urlTitle)
})


router.get("/:pageName/similar", function(req, res, next) {

	var urlTitle = req.params.pageName

	Page.findOne({"urlTitle": urlTitle}).exec()
		.then(function(foundPage){
				return foundPage.findSimilar()
			})
		.then(function(arrayOfSimilarPages) {
				res.render("index", {"pages": arrayOfSimilarPages})
			})
		.then(null, next);
})





module.exports = router;








