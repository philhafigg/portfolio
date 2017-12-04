apa.namespace.extend( 'utils', {
	
	/*
		creates a pseudo-unique id
		
		@param defines the character-length of the id (default = 8). Character-length has to be a multiple of 4
	*/
	uniqId: function (chars) {
		
		var tCount		=	parseInt( chars/4, 10) || 2;					
		var uid			=	'';					
		var getRandom	=	function() {

			return ( ( (1 + Math.random() ) * 0x10000 ) | 0 ).toString(16).substring(1);
		};

		for (var i = 0; i < tCount; i++) {

			uid += getRandom();
		}
	
		return uid;
	},
	
	/*
		Returns the number of elements in an object.
		
		@param obj is the JSON-Object we want to have the size of.
		@returns the size of the JSON-Object.
	*/
	getObjectSize: function(obj) {

		var size = 0;
		var key;

		for (key in obj) {

			if (obj.hasOwnProperty(key)) size++;
		}

		return size;
	}
});