apa.namespace.extend( 'observer.site', function() {

	this.frameId = false;			// Has to be passed
	
	this.init = function() {					
		
		apa.debug.showInfo(this.frameId + 'Starting observer.site');
		
		this.checkHeaderStyleTag();
		this.bindEvents();					
		this.resize();
	};
	
	this.checkHeaderStyleTag = function() {
		
		if (apa.visual[ this.namespace ].config.optional.calculatedStyle) {
			
			var tHtml = '<style id="' + apa.visual[ this.namespace ].config.optional.calculatedStyle + '"></style>';				// calculated styles are always the last style-sheet (apart from calculated min-/max-font-size styles) and have to be documented for the clients accordingly
				
			japa('head').append( tHtml );
		}
	};
	
	this.bindEvents = function() {
		
		japa(window).on( 'resize', japa.proxy( this.resize, this ) );
		japa(window).on( 'resize', japa.proxy( this.inform, this ) );
	};
	
	/*
		Informs every object that is interested about the site-resize, plus tells the stylefills-observer to run
	*/
	this.inform = function() {
		
		var tEvent = japa.Event( this.frameId + apa.events.site.resized );
		
		japa(document).triggerHandler( tEvent );
		
		tEvent = japa.Event( apa.events.stylefills.checkStyles );
		
		japa(document).triggerHandler( tEvent );
	};
	
	/*
		This function changes the apaCalculatedStyles-Tag	
	*/
	this.resize = function() {
		
		apa.debug.showInfo( this.frameId + ': observer.site.resize has not yet been extended. If you don\'t need it, you can ignore this.' );
	};
});