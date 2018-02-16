const HasProperty = ( a, b ) => Object.prototype.hasOwnProperty.call( a, b ); // eslint-disable-line

/*
 * converts object to array
 * obj - object - object to be turned into array
 *
 * returns array
 */
const objToArray = function convertObjectToArray( object ) { // eslint-disable-line

	if ( object === null || object === undefined ) {
		return [];
	}

	const keys  = Object.keys( object );
	const array = keys.reduce( ( arr, key ) => {

		const obj = object[key];

		if ( !HasProperty( obj, 'key' ) ) {
			obj.key = key;
		}

		arr.push( obj );

		return arr;

	}, [] );

	return array;

};

/* converts array to object
 * array - array of objects - array to convert into an object
 * 				(preferrably each of this array's objects have a property called 'key')
 *
 * returns object
 */
const arrayToObj = function convertArrayToObject( array ) { // eslint-disable-line

	const object = {};

	for ( const i in array ) { // eslint-disable-line

		const arrayItem = array[i];

		if ( typeof ( arrayItem ) !== 'object' ) {
			console.log( array );
			return console.error( 'This array has an element that is not an object at index: ' + i + '. This function is only for arrays of objects. Please view the array above.' ); // eslint-disable-line
		}

		const key = arrayItem.key;

		if ( key === undefined ) {
			console.log( array );
			return console.error( 'An object in this array has no "key" property. Index: ' + i ); // eslint-disable-line
		}

		delete arrayItem.key;

		object[key] = arrayItem;

	}

	return object;

};

