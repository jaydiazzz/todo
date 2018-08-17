const app = new Vue( { // eslint-disable-line
	el : '.wrapper',

	created() {

		firebase.auth().onAuthStateChanged( ( user ) => {

			const { uid } = user;

			this.uid = uid;

			FbRef.child( 'tasks' )
			.child( uid )
			.on( 'value', ( snapshot ) => {

				const tasks = snapshot.val();

				this.tasks = tasks;
			} );
		} );
	},

	mounted() {
		firebase.auth().onAuthStateChanged( ( user ) => {

			if ( user ) {

				const firstName = user.displayName.split( ' ' );

				this.name  = firstName[0];
				this.email = user.email;
				this.user  = user.user;

				this.loginPrompt = 'closed';
			}

			else {

				console.log( 'nope' );
				this.name     = null;
				this.email    = null;
				this.password = null;
				this.user     = null;

				this.loginPrompt = 'open';
			}
		} );
	},

	data : {
		uid : null,

		name     : null,
		email    : null,
		user     : null,
		password : null,

		title : null,
		desc  : null,

		tasks : {},
		key   : null,

		loginPrompt : 'closed',
	},

	methods : {
		submit() {
			let description = this.desc;

			if ( description === 'Description (optional)' ) {
				description = ' ';
			}

			const fbUser = firebase.auth().currentUser.uid;
			const FbRef  = firebase.database().ref();

			FbRef.child( `tasks/${fbUser}` ).push( {
				title : this.title,
				desc  : description,
			} );
		},

		login() {
			const provider = new firebase.auth.GoogleAuthProvider();

			firebase
			.auth()
				.signInWithPopup( provider )
				.then( function ( result ) {
					// This gives you a Google Access Token. You can use it to access the Google API.
					const token = result.credential.accessToken;
					// The signed-in user info.
					const user = result.user;
					this.name = user.email;
				} );
		},

		logout() {
			firebase
                .auth()
                .signOut()
				.then( () => {
					console.log( 'signed out user' );
				} )
				.catch( ( error ) => {
					console.log( error );
				} );
		},

		remove( key ) {
			FbRef.child( 'tasks' )
			.child( this.uid )
			.child( key )
			.remove();
		}
	},
} );
