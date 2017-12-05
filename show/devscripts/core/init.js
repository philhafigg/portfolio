brain.namespace.extend( 'visual.show.init', function() {
	
	$.extend( this, new brain.init() ); 
	
	this.getFramework = function(frameId) {

		return new brain.visual.show.framework.controller(frameId);
	};
});