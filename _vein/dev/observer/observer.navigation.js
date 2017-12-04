apa.namespace.extend( 'observer.navigation', function() {

	this.frameId = false;			// Has to be passed
		
	this.init = function() {
		
		apa.debug.showInfo('Starting observer.navigation');
		
		japa(document).on( this.frameId + apa.events.framework.done, japa.proxy( this.start, this ) );
	};
	
	this.start = function() {
		
		apa.debug.showError( 'navigation.start has not been extended');
	};
});