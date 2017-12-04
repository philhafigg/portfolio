apa.namespace.extend( 'setup.css', function() {
	
	this.append = function(visuals, type, deferred) {
		
		apa.debug.showInfo( 'Appending ' + type + 'css' );
		
		japa.each( visuals, function(key, value) {
			
			var filePath = apa.params.paths[ type ].css;
				
			if (type === 'apa' && apa.params.development) filePath = apa.params.paths[ 'dev' ].css;			// switch to devcss directory for development
			
			var tPath	=	filePath + '/' + type + '.' + value + '.css';			
			var sheet	=	japa( '<link rel="stylesheet" href="' + tPath + '" type="text/css" media="all" />' );
								
			japa('head').append( sheet );
			
			/* Send the stylesheet-data to the stylefill-observer */
			var tEvent		=	japa.Event( apa.events.stylefills.append );
			tEvent.content	=	tPath;
			
			japa(document).triggerHandler( tEvent );
		});	
		
		deferred.resolve();	
	};
});