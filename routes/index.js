var express    = require('express');
var path       = require('path');
var bodyParser = require('body-parser');
var firebase   = require('firebase-admin');

var router = express.Router();

/* ---------------- GET ---------------- */

router.get('/', function( req, res, next ) {
	res.render('index');
})

module.exports = router;
