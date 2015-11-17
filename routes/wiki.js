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
	res.redirect("/");
})


router.get("/add", function(req, res, next) {
	//retrieve the "add a page" form
	res.render("addpage");
})


router.post("/", function(req, res, next) {
	//submit new page to the database

	//Create a new page instance / document:
	var page = new Page({
		title: req.body.title,
		content: req.body.pageContent
		// urlTitle: models.generateUrlTitle(req.body.title)
	})

	//Save Page and redirect home (validation occurs before save):
	//By the way, within the save function, we also validate. 
	//Meaning that before validation occurs we will generate 
	//the proper urlTitle thanks to our pre-validate hook.

	//That is, new documents are never saved to the db without having 
	//a urlTitle based on the title
	page.save()
	.then(
		function(savedPage){
			res.json(savedPage);
		}, 
		function(err) {
			console.log(err)});
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
			res.render("wikipage", {"Page": foundPage})
			console.log("This is FOUNDPAGE: ", foundPage);
			// console.log("This is Page: ", Object.keys(Page));
			// console.log("This is Page.collection.collection", Page.collection.collection)
			},
			function(err) {
				res.send("You are hitting the error: ", err)
			})


	// res.send("hit a dynamic route at " + urlTitle)
})








module.exports = router;








