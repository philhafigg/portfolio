apa.namespace.extend( 'formatting', {
				
	/*
		Returns a (country-specific) pretty formatted and rounded number.
		
			Defaults are for English, other values have to be passed.
	*/
	getPrettyNumber: function(number, country, round) {

		var del			=	',';
		var dec			=	'.';
		var output		=	'';
		
		if ( country && country.indexOf('deu') > -1 ) {
			
			del = '.';
			dec = ',';
		}
		
		if ( country && country.indexOf('gsw') > -1 ) {
			
			del = '\'';
		}
		
		if (round > 0) {
			
			number = parseFloat(number).toFixed(round);
		}
	
		var numString	=	'' + number;		
		var tMinus		=	false;
		
		if (numString.substr(0, 1) == '-') {
			
			numString = numString.substr(1, numString.length);
			tMinus = true;
		}		
		
		numString = numString.split('.');
		
		if ( numString[0].length > 3 ) {
			
			var mod	=	numString[0].length % 3;
			output	=	( mod > 0 ? (numString[0].substr( 0, mod ) ) : '' );
			
			for (var i = 0 ; i < Math.floor( numString[0].length/3 ); i++) {
				
				if ( (mod === 0) && (i === 0) ) {
					
					output += numString[0].substring( mod + 3 * i, mod + 3 * i + 3);
				} else {
					
					output += del + numString[0].substring(mod + 3 * i, mod + 3 * i + 3);
				}
			}
		} else {
			
			output = numString[0];
		}
		
		if (numString.length > 1) {
			
			output += dec + numString[1];
		}
		
		if (tMinus) {
			
			output = '-' + output;
		}
		
		return output;
	},
	
	/*
		Writes the first letter of a string in uppercase, the rest in lowercase
		
			@param		is the string we want to modify
			@returns	the modified string or false if there was no string passed.
	*/
	firstUpperCase: function(tString) {
		
		if ( typeof(tString) == 'string') {
						
			tString = tString.toLowerCase();
			
			return tString.replace( /^./, tString[0].toUpperCase() );
		}
		
		return false;
	}
});