apa.namespace.extend( 'loader.language', function() {
	
	japa.extend( this, new apa.loader() );
	
	this.idPrefix	=	'loader:language';
	this.defObj		=	false;
	this.namespace	=	false;
	/*
		Different because we need different default options.
	*/
	this.getParams = function(options) {
		
		return apa.params.loader.language;
	};
	
	/*
		Different because we need the deferred object and the namespace
	*/
	this.success = function(data, textStatus, jqXHR) {
		
		if (!apa.data.language)							apa.data.language = {};
		if (!apa.data.language[ this.namespace ])		apa.data.language[ this.namespace ] = {};
		
		japa.extend(apa.data.language[ this.namespace ], data);
		
		this.options.deferred.resolve();
	};
});