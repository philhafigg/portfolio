apa.namespace.extend( 'loader.configs', function() {
	
	japa.extend( this, new apa.loader() );
	
	this.idPrefix	=	'loader:configs';
	this.defObj		=	false;
	this.namespace	=	false;
	
	/*
		Different because we need different default options.
	*/
	this.getParams = function(options) {
		
		return apa.params.loader[ 'configs' ];
	};
	
	/*
		Different because we need the deferred object and the namespace
	*/
	this.success = function(data, textStatus, jqXHR) {

		japa.extend(apa.visual[ this.namespace ].config, data);
		
		this.options.deferred.resolve();	
	};
	
	this.errorInfo = function() {
		
		console.info('↑↑↑>>> "' + this.options.url + '" is optional! Ignore the error or create the jsonp config. [instructions -> technical documentation] <<<↑↑↑' );
	};
});