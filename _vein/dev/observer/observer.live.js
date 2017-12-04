apa.namespace.extend( 'observer.live', function() {
	
	this.loader;
	this.data		=	false;
	this.frameId	=	false;			// Has to be passed
	
	this.init = function() {
		
		apa.debug.showInfo( this.frameId + ': Starting observer.live');
		
		this.loader	=	new apa.loader();
		
		this.loader.setOptions({
		
			url:		this.getUrl(),
			success:	japa.proxy( this.sendUpdates, this )
		});
		
		this.update();
	};
	
	this.update = function() {					
		
		var that = this;
		
		this.loader.load();
		
		window.setTimeout( function() {
			
			that.update();
		}, apa.params.timers.live);
	};
	
	this.sendUpdates = function(tData) {
		
		if (!this.data) {
			
			this.data = tData;	
		} else if ( this.check(tData) ) {
			
			var tEvent		=	japa.Event( apa.items[ this.frameId ].config.namespace + apa.events.updater.inform );
			tEvent.content	=	tData;
			
			japa(document).triggerHandler( tEvent );
								
			if (this.loader.options.jsonpCallback) {

				eval( 'delete ' + this.loader.options.jsonpCallback.toString() );
			}
		}
	};
	
	this.check = function(data) {
					
		var tBool = false;
		
		japa.each(this.data, function(key, value) {

			if (!data[key]) {
				
				tBool = true;
				return false;
			}
			
			if (data[key].lastUpdate != value.lastUpdate) {
				
				tBool = true;
				return false;
			}
		});

		return tBool;
	};
	
	this.getUrl = function() {
		
		apa.debug.showError( this.frameId + ': live.getUrl has not been extended');
	};
});