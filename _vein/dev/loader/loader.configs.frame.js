apa.namespace.extend( 'loader.configs.frame', function() {
	
	japa.extend( this, new apa.loader.configs() );
	
	this.idPrefix	=	'loader:configs:frame';
	this.defObj		=	false;
	this.namespace	=	false;
	this.frameId	=	false;
	
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

		japa.extend(apa.items[ this.frameId ].config, data);
		
		this.options.deferred.resolve();
	};
});