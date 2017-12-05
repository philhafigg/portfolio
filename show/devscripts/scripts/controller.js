brain.namespace.extend( 'visual.show.scripts.controller', function(frameId) {
	
	$.extend( this, new brain.controller(frameId) );
	
	this.id		=	'show:scripts:controller';
	this.model	=	'scripts:model';
	
	this.view = function(data) {

		return new brain.visual.show.scripts.view(this.frameId);
	};
});