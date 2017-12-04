apa.namespace.extend( 'setup.params', function() {
	
	this.load = function(deferred) {
		
		var defObj	=	japa.Deferred();
		var loader	=	this.getLoader();
		
		japa.when(defObj).then( function() {
			
			deferred.resolve();
		});
			
		var changedOptions = {
		
			url:		this.getUrl(),
			deferred:	defObj
		};
		
		loader.setOptions( changedOptions );
		loader.load();
	};

	this.getLoader = function() {
		
		return new apa.loader['scripts']();	
	};

	this.getUrl = function() {
		
		var scriptArr	=	japa('script');
		var scriptUrl	=	'';
		
		japa.each( scriptArr, function() {	
			
			var spineFile = 'apa.spine.' + apa.params.version + '.min.js';
			
			if (apa.params.development) spineFile = 'apa.spine.' + apa.params.version + '.js';
			
			if ( this.src.indexOf(spineFile) > -1 ) {
				
				scriptUrl = this.src.replace( spineFile, 'client.spine.params.js' );
				
				return false;
			}
		});
		
		return scriptUrl;
	};
});