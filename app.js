/* ------------- dependencies ------------- */

var fs         = require('fs');
var https      = require('https');
var express    = require('express');
var path       = require('path');
var bodyParser = require('body-parser');

let envConfig;

try {

	envConfig = require("./env");

} catch ( e ) {

	console.log("There was a problem reading env.json. It should be in the root of your project")

	throw new Error( e )

}

if ( !envConfig.hasOwnProperty("NODE_ENV") )
	throw new Error("You must specify your NODE_ENV in env.json")

// set environment config
for ( var i in envConfig ) {

	try {

		if ( process.env[i] != undefined )
			console.warn(`env.json overwrites environment variable ${ i }. Currently it is ${ process.env[i] }. env.json specifies ${ envConfig[i] }`)

		process.env[i] = envConfig[i];

	} catch ( e ) {

		envVariablesSet = false;

		throw new Error("Couln't set environment variable: ", i );

		break;

	}

}

// FIREBASE //
var firebase = require('firebase-admin');                                // 'firebase' node module is outdated.

/* ---------------- routes ---------------- */

var index = require('./routes/index');

/* ---------------- config ---------------- */
var app = express();

// VIEW ENGINE //
app.set('views', path.join( __dirname, 'views' ));                       // use ./views as views directory
app.set('view engine', 'pug');                                           // use pug as our templating engine

// ENV MIDDLEWARE //
var env = process.env.NODE_ENV;
app.use(function( req, res, next ) {
	res.locals.env = env; 												 // passes env variable to pug
	next();
})

// RESOURCES //
app.use('/static', express.static( __dirname + '/public') );             // serve requests to /static from /public

// REQUEST PARSING //
app.use(bodyParser.json());                                              // parse post requests as JSON data
app.use(bodyParser.urlencoded({ extended: false }));                     // do not allow nested objects in a post request

// ROUTING //
app.use('/', index);

// ERRORS //
app.use(function(req, res, next) {
	var err = new Error("Sorry! We were unable to find this page");
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	var title;
	if (err.status == 404) {
		title = "404: File Not Found"
	}
	else {
		title = "'500: Internal Server Error'"
	}
	res.render('error', {
		message: err.message,
		status : err.status || 500,
		error: {},
		title: title
	});
});

/* ---------------- create ---------------- */

var port = process.env.PORT || 4200;
app.listen( port , function() {
	console.log("non-secure server on port " + port );
});
