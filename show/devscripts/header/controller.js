brain.namespace.extend( 'visual.show.header.controller', function(frameId) {
	
	$.extend( this, new brain.controller(frameId) );
	
	this.id		=	'show:header:controller';
	
	this.view = function(data) {

		return new brain.visual.show.header.view(this.frameId);
	};
});