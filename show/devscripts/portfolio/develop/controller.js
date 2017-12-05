brain.namespace.extend( 'visual.show.portfolio.develop.controller', function(frameId) {
	
	$.extend( this, new brain.visual.show.portfolio.abstract.controller(frameId) );
	
	this.id		=	'show:portfolio:develop:controller';
	this.model	=	'portfolio:develop:model';
	
	this.view = function(data) {

		return new brain.visual.show.portfolio.detail.view(this.frameId);
	};
});