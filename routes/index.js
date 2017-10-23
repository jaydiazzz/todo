const { Router } = require( 'express' );
const firebase   = require( 'firebase-admin' );

try {

	const serviceAccount = appRequire( 'worker-service-account' );

	firebase.initializeApp( {
		credential  : firebase.credential.cert( serviceAccount ),
		databaseURL : process.env.DATABASE_URL,
	} );

}

catch ( e ) {

	throw new Error( 'Please obtain a service account for this project\'s database.' );

}

const router = Router();

/* ---------------- GET ---------------- */

router.get( '/', ( req, res ) => {

	res.render( 'index' );

} );

module.exports = router;
