apa.namespace.extend( 'controller.framework', function(frameId) {
	
	japa.extend( this, new apa.controller(frameId) );
						
	this.idPrefix	=	'controller:framework';
	this.frameId	=	frameId;					// has to be passed from init
	
	this.init = function(container) {
		
		apa.debug.showInfo( '#' + this.frameId + ': Initializing ' + this.id );
						
		this.bindEvents();
		
		if (!container) container = '';
			
		this.container = '#' + this.frameId + ' ' + container;
		
		this.getData();
		
		var tEvent = japa.Event( this.frameId + apa.events.framework.done );
		
		japa(document).triggerHandler( tEvent );
	};
});