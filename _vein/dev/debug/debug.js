apa.namespace.extend( 'debug', {
	
	showError: function(msg) {
		
		if (apa.params.debug) {
			
			if (typeof console !== "undefined") {
					
				if (typeof console.log !== "undefined") {
			
					console.error('ERROR: ' + msg);
				}
			}
		}
	},
	
	showInfo: function(msg) {
		
		if (apa.params.debug) {
			
			if (typeof console !== "undefined") {
					
				if (typeof console.log !== "undefined") {
			
					console.log('INFO: ' + msg);
				}
			}
		}
	}
});