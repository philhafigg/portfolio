brain.namespace.extend( 'visual.show.framework.controller', function(frameId) {
	
	$.extend( this, new brain.controller.framework(frameId) );
	
	this.id = 	'framework:controller';
	
	this.view = function() {

		return new brain.visual.show.framework.view( this.frameId );
	};	
});