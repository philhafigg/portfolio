apa.namespace.extend( 'setup.languages', function() {
	
	this.load = function(visuals, deferred) {
		
		apa.debug.showInfo( 'Loading languages' );
		
		var defArr	=	[];
		
		japa.each( visuals, function() {

			var language	=	'de';			
			var namespace	=	this + '';
			var defObj		=	japa.Deferred();
			var loader		=	new apa.loader.language();
			
			if (apa.visual[namespace].config.language) {
				
				language = apa.language.getLanguage( apa.visual[namespace].config.language );
			} else {
				
				apa.visual[namespace].config.language = 'deu';
			}
			
			defArr.push( defObj );
			
			var tPath = apa.params.paths.apa.language;
			
			if (apa.params.development) tPath = apa.params.paths.dev.language;			// for development we switch to devlanguage
			
			loader.setOptions({
			
				jsonpCallback:	'apaCallbackLang' + apa.formatting.firstUpperCase(namespace),
				url:			tPath + '/' + namespace + '.' + language + '.js',
				deferred:		defObj,
			});
			
			loader.namespace	=	namespace;
			
			loader.load();
		});
		
		japa.when.apply( this, defArr ).then( function() {

			deferred.resolve();	
		});
	};
});