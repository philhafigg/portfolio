apa.namespace.extend( 'loader.items', function() {
	
	japa.extend( this, new apa.loader() );
	
	this.idPrefix	=	'loader:items';
	
	/*
		Different because we need different default options.
	*/
	this.getParams = function(options) {
		
		return apa.params.loader.items;
	};
});