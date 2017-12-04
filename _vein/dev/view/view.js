apa.namespace.extend( 'view', function(frameId) {
	
	this.frameId = frameId;			// Has to be passed
	
	this.get = function(data) {
		
		apa.debug.showError( this.frameId + ': .get has to be extended in this view.' );
	};
});