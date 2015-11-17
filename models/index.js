//****GIVEN TO US*******
var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));
//****GIVEN TO US*******


var Schema = mongoose.Schema;


var pageSchema = new Schema({
	title: {type: String, required: true},
	urlTitle: {type: String, required: true},
	content: {type: String, required: true},
	status: {type: String, enum: ['open', 'closed']},
	date: {type: Date, default: Date.now},
	author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

var userSchema = new Schema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true}
})


pageSchema.virtual("route").get(function() {
	return '/wiki/' + this.urlTitle;
})




var generateUrlTitle = function(title) {
	if (title) {
		// Removes all non-alphanumeric characters from title
		// And make whitespace underscore
		return title.replace(/\s+/g, '_').replace(/\W/g, '');
	} 
	else {
		// Generates random 5 letter string
		return Math.random().toString(36).substring(2, 7);
	}
}



//Pre-validation, generate proper urlTitle:

//Before we validate, generate a proper urlTitle 
//so that we don't get an error:
pageSchema.pre("validate", function(next, done) { 
	this.urlTitle = generateUrlTitle(this.title);
	next();
})





//Page Model, to manage data from our Page collection:
var Page = mongoose.model("Page", pageSchema);

//User Model, to manage data from our User collection:
var User = mongoose.model("User", userSchema);


// A Mongoose model is an object that represents a collection; 
// it has various methods for easy CRUD operations, like finding 
// a specific document or creating a new document. Models are 
// going to be the primary way you actually interact with Mongo 
// in your application's behavior layers.



module.exports = {
  Page: Page,
  User: User,
  generateUrlTitle: generateUrlTitle
};