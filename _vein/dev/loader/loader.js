apa.namespace.extend( 'loader', function() {
		
	this.idPrefix	=	'loader';
	this.id			=	false;
	this.progress	=	0;
	this.options	=	{};
	this.origURL	=	false;
	this.origCache	=	-1;
	
	this.parent = {
		
		/*
			We need to set the event options first, because of the this.
		*/
		getEventOptions: function() {		
			
			return {

				beforeSend:		japa.proxy( this.sendStart,	this ),
				xhr:			japa.proxy( this.sendProgress, this ),
				error:			japa.proxy( this.error,	this ),
				complete:		japa.proxy( this.complete, this ),
				success:		japa.proxy( this.success, this ),
			};
		},
	
		/*
			At first call, this function defines a uniqe id, when called again, it returns the same id again and again.
		*/
		getId: function() {

			if (!this.id) {
				
				this.id = apa.utils.uniqId();
			}
			
			return this.idPrefix + this.id;

		},
		
		/*
			1.) Extends the this.options by the apa.params.loader.default options.
			2.) Extends the options by the event options, those has to be set by the loader because of the this.
			3.) Extends the options by passed options, to overwrite or set any of the options.
		*/
		setOptions: function(options) {
			
			japa.extend( this.options, this.getParams() );
			japa.extend( this.options, this.getEventOptions() );
			
			if (options) {
				
				for (var i in options) this.options[i] = options[i];
			}
		},			
					
		getTimestamp: function() {
				
			var time = new Date().getTime();
			
			if (apa.params.timestamp === 'hs') {
				
				time = parseInt( time / 100, 10 );
			} else if (apa.params.timestamp === 'sec') {
				
				time = parseInt( time / 1000, 10 );
			} else if (apa.params.timestamp === 'tensec') {
				
				time = parseInt( parseInt( time / 10000, 10 ).toString() + '0', 10 );
			}  else if (apa.params.timestamp === 'min') {
				
				time = parseInt( parseInt( time / 60000, 10 ).toString() + '0', 10 );
			}
			
			return time;
		},
		
		/*
			Can be extended if needed	
		*/
		getParams: function() {
			
			return apa.params.loader['default'];
		},
		
		/*
			Ajax call with options.
		*/
		load: function() {
			
			this.progress = 0;			
						
			if (this.origCache === -1) {
									
				this.origCache = this.options.cache;
			}
			
			if (this.origCache === false) {
				
				// we have to introduce our own logic of setting a timestamp
				
				if (!this.origURL) this.origURL = this.options.url + '';
				
				this.options.cache	=	true;
				
				var urlBinder		=	'?_=';
				
				if ( this.origURL.indexOf( '?' ) > -1 ) {
					
					urlBinder = '&_=';
				}
				
				this.options.url = this.origURL + urlBinder + this.getTimestamp();
			}
									
			japa.ajax( this.options );
		},
		
		/*
			Before the ajax functions sends the request, this function is called, because of the progress bar.
		*/
		sendStart: function() {
							
			if (this.options.hasProgress) {
				
				var tEvent = japa.Event( apa.events.loader.started + this.getId() );
				
				japa(document).triggerHandler( tEvent );
			}
		},
		
		/*
			XHR triggered function for the progress bar, which sets the this.progress value.
		*/
		sendProgress: function() {

			if ( this.sendProgress ) {
			
				var that	=	this;
				var xhr		=	new window.XMLHttpRequest();
	
				xhr.addEventListener("progress", function(ev) {
				
					if (ev.lengthComputable) {
					
						that.progress = parseFloat( (ev.loaded / ev.total ) * 100 ).toFixed(2);	
					} else {
						
						if (that.progress < 60) {
						
							that.progress += 20;
						} else if (that.progress < 80) {
							
							that.progress += 4;
						} else {
							
							that.progress += 2;
						}
						
						if (that.progress >= 100) that.progress = 100;
					}

					var tEvent		=	japa.Event( apa.events.loader.progress + that.getId() );
					tEvent.content	=	that.progress;

					japa(document).triggerHandler( tEvent );
					
				}, false);
			
				return xhr;
			}
		},
		
		/*
			When the server responds without an error and in case there is a progress bar, this function triggers the apa.events.loader.progress event.
		*/
		complete: function() {
						
			if (this.options.hasProgress) {
				
				var tEvent = japa.Event( apa.events.loader.ended + this.getId() );
				
				japa(document).triggerHandler( tEvent );
			}
		},
		
		/*
			In case of respond errors, this function shows the error via apa.debug.showError and sends an error event. 
		*/
		error: function(data, textStatus, jqXHR, exception) {
						
			var tStatus	=	data.status;
			var parseError	=	jqXHR.message;
				
			if ( this.options.dataType == 'jsonp' && tStatus == 200 && parseError.indexOf('was not called') > -1 ) {
							
				var tData = this.extractJson( data.responseText );
			
				this.options.success(tData, tStatus, jqXHR);
			} else if ( this.options.dataType == 'jsonp' && tStatus == 200 ) {
				
				/*
					Do nothing	
				*/
			} else {
				
				var tError		=	'File could not be loaded: ' + tStatus + ', ' + parseError + ', ' + this.options.url;
				
				this.errorInfo();
				
				apa.debug.showError( tError );
				
				var tEvent		=	japa.Event( apa.events.loader.error + this.getId() );
				tEvent.content	=	tError;
				tEvent.loaderId	=	this.getId();
								
				japa(document).triggerHandler( tEvent );
				
				if (this.options.deferred) {
					
					this.options.deferred.resolve();
				}
								
				if ( this.sendProgress ) {
					
					this.complete();
				}
			}
		},
	
		/*
			Can be extended if needed	
		*/
		errorInfo: function() {
		
		},
		
		/*
			Resolves the deferred, in case no deferred is set in the options, this functions triggers the loader.done event.
		*/
		success: function(data, textStatus, jqXHR, exception) {
			
			if (this.options.deferred) {
				
				this.options.deferred.resolve();	
			} else {
						
				var tEvent = japa.Event( apa.events.loader.done + this.getId() );
						
				japa(document).triggerHandler( tEvent );
			}
		},
		
		/*
			Converts jsonp into json.
		*/
		extractJson: function(tText) {
						
			var startIndex	=	tText.indexOf( '{' );
			var stopIndex	=	tText.lastIndexOf( '}' ) + 1;
			var json		=	tText.substring( startIndex, stopIndex );			
			
			json = japa.parseJSON(json);
			
			return json;
		}
	};
	
	this.getTimestamp		=	this.parent.getTimestamp;
	this.getParams			=	this.parent.getParams;
	this.getEventOptions	=	this.parent.getEventOptions;
	this.getId				=	this.parent.getId;
	this.setOptions			=	this.parent.setOptions;
	this.load				=	this.parent.load;
	this.sendStart			=	this.parent.sendStart;
	this.sendProgress		=	this.parent.sendProgress;
	this.complete			=	this.parent.complete;
	this.error				=	this.parent.error;
	this.errorInfo			=	this.parent.errorInfo;
	this.success			=	this.parent.success;
	this.extractJson		=	this.parent.extractJson;
});	