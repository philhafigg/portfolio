apa.namespace.extend( 'loader.scripts', function() {
	
	japa.extend( this, new apa.loader() );
	
	this.idPrefix	=	'loader:scripts';
	
	/*
		Different because we need different default options.
	*/
	this.getParams = function(options) {
		
		return apa.params.loader[ 'scripts' ];
	};
	
	this.errorInfo = function() {
		
		console.info('↑↑↑>>> "' + this.options.url + '" is optional! Ignore the error or create an empty file. <<<↑↑↑' );
	};
});