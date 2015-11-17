var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var swig = require("swig");
var wikiRouter = require("./routes/wiki");

//Instatiating Express
var app = express();


app.listen(3000, function() {
	console.log("Listening on port, 3000");
})


//Static Routing:
app.use(express.static(__dirname + '/public'));

//Morgan to log info about each incoming request:
app.use(morgan("dev"));

//Body Parser:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));




//**************SWIG******************************
// point res.render to the proper directory
app.set('views', __dirname + '/views');
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files
// have it use swig to do so
app.engine('html', swig.renderFile);
// turn of swig's caching
swig.setDefaults({cache: false});
//**************SWIG******************************



//ROUTING:
app.use("/wiki", wikiRouter);