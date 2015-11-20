//****GIVEN TO US********************************************************
var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server, which handles database requests and sends responses. It's async!

//mongoose.connect connects to our wikistack database:
mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'

//here we create a reference to that connection, with var db:
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));
//****GIVEN TO US********************************************************



//Mongoose is an Object Document Mapper (ODM). 
//ODM's model/represent our data as objects, 
//with properties and methods. 


//A model is simply a useful representation of our data. 


var Schema = mongoose.Schema;


var pageSchema = new Schema({
	title: {
		type: String, 
		required: true
	},
	urlTitle: {
		type: String, 
		required: true
	},
	content: {
		type: String, 
		required: true
	},
	status: {
		type: String, 
		enum: ['open', 'closed']
	},
	date: {
		type: Date, 
		default: Date.now
	},
	author: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User'
	},
	tags: {
		type: [String]
	}
})

var userSchema = new Schema({
	name: {
		type: String, 
		required: true
	},
	email: {
		type: String, 
		required: true, 
		unique: true
	}
})



//Since route is constructed entirely from urlTitle, it doesnt really make sense
//to give our Page model a route property. If we did, every time we wanted to 
//create a page or update a title we'd have to remember to deal with
//both the urlTitle AND the route, which is extra work / is redundant.

//We don't want to actually store the route in the database,
//since it is constructed entirely from the urlTitle.
pageSchema.virtual("route").get(function() {
	return '/wiki/' + this.urlTitle;
})


//In Mongoose, a static method is one placed on a model, 
//allowing manipulation of a collection. 


//Statics are called off of models (i.e. off of Page).
pageSchema.statics.findByTag = function(tag) {
	//Find/return all pages
	return Page.find({
		//Whose tags array
    	tags: {
	    	// contains tag
    		$in: [tag]
    	}
    //promise:		
	}).exec();
}



//Methods are called off of a specific model instance / document.
pageSchema.methods.findSimilar = function() {
	//Find/return all pages
	return Page.find({
		//Whose tags array
    	tags: {
	    	// contains any tag from this page's tags array
    		$in: this.tags
    	},
    	//and whose id
    	_id: {
    		//is not equal to this page's id
    		$ne: this._id
    	}
    //promise:		
	}).exec();
}



userSchema.statics.findOrCreate = function(objectWithNameAndEmail) {
	//Find/return a user with a matching email
	return User.findOne({email: objectWithNameAndEmail.email}).exec()
		.then(function(user){
			//if user is not falsey (i.e. null), return the user
			if(user) return user;
			//if the user is null, create a new one
			else return User.create({
					name: objectWithNameAndEmail.authorName,
					email: objectWithNameAndEmail.authorEmail
				})
		})
}




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


//pre-validate hook:
//Before we validate any new document, generate a proper 
//urlTitle so that we don't get an error
pageSchema.pre("validate", function(next) { 
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


