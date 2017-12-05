brain.namespace.extend( 'visual.show.portfolio.three.controller', function(frameId) {
	
	$.extend( this, new brain.visual.show.portfolio.abstract.controller(frameId) );
	
	this.id		=	'show:portfolio:three:controller';
	this.model	=	'portfolio:three:model';
	
	this.view = function(data) {

		return new brain.visual.show.portfolio.detail.view(this.frameId);
	};
});