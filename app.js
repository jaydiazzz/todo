/* ------------- dependencies ------------- */

var fs         = require('fs');
var https      = require('https');
var express    = require('express');
var path       = require('path');
var bodyParser = require('body-parser');

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
var env = process.env.NODE_ENV || 'production';
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

/* ---------------- create ---------------- */

var port = process.env.PORT || 3000;
app.listen( port , function() {
	console.log("non-secure server on port " + port );
});
