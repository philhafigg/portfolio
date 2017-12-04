apa.namespace.extend( 'observer.clicks', function() {
	
	this.frameId = false;			// Has to be passed
	
	this.init = function() {
		
		apa.debug.showInfo( this.frameId + ': observer.clicks has not yet been extended. If you don\'t need it, you can ignore this.' );
	};
});