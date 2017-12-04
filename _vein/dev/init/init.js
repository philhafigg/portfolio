apa.namespace.extend( 'init', function() {
	
	this.frameId	=	false;
	this.namespace	=	false;
	
	/*
		Configuration for every spine-based application.
		
		1.) Extract params of the url
		2.) Font.stylefill
		3.) Initializes observers
		4.) In case the client wants to customize individual frames, the param frameSetting has to be an array containing the settings for the frameID in the config in the client.config
	*/
	this.configure = function() {
		
		apa.debug.showInfo( 'Configuring' );

		this.cloneConfig();

		if (apa.visual[ this.namespace ].config.frameSetting && apa.visual[ this.namespace ].config.frameSetting[ this.frameId ] ) {
		
			this.getOptionalComponents();	
		} else {
			
			this.start();
		}			
	};
	
	/*
		Initializes the observer of the application, e.g. apa.visual.sport.observer.
		In case we dont have an observer defined, this function won't throw an error.
	*/
	this.observers = function() {
		
		var that = this;

		apa.debug.showInfo( 'Initializing observers' );
		
		if (!apa.items[ this.frameId ].config.codebase) {
		
			apa.debug.showError( 'There is no app-namespace defined' );
		} else {
			
			var codebase = this.namespace;
			
			if ( apa.visual[ codebase ].observer ) {

				japa.each( apa.visual[ codebase ].observer, function() {
					
					var tObserver = new this();
					
					tObserver.namespace	=	that.namespace;
					tObserver.frameId	=	that.frameId;
					
					tObserver.init();
				});	
			}
		}
	};
	
	/*
		Every frame needs its own config, therefore we need to clone the visual config into the items	
	*/
	this.cloneConfig = function() {
		
		var clonedConfig	=	japa.extend( true, {}, apa.visual[ this.namespace ].config );
		
		japa.extend( clonedConfig, apa.items[ this.frameId ].config );
		
		apa.items[this.frameId].config = clonedConfig;
	};
	
	/*
		Every Client has a client.css which is named like the codebase, e.g. clientcss/client.sport.css
		Every Client has a client.script which is named like the codebase, e.g. clientscript/client.sport.js
	*/
	this.getOptionalComponents = function() {
		
		var defArr			=	[];
		var frameSetting	=	apa.visual[ this.namespace ].config.frameSetting[ this.frameId ];
		var defObj;
		
		if (frameSetting.sheet) {
			
			defObj = japa.Deferred();
			this.appendOptionalStyle(apa.params.paths.client.css + '/client.' + this.frameId + '.css', defObj);
			defArr.push(defObj);
		}
		
		if (frameSetting.script) {
			
			defObj = japa.Deferred();
			this.loadOptionalScript(apa.params.paths.client.script + '/client.' + this.frameId + '.js', defObj);
			defArr.push(defObj);
		}

		if (frameSetting.config) {
			
			defObj = japa.Deferred();
			this.loadOptionalConfig(apa.params.paths.client.config + '/client.config.' + this.frameId + '.js', defObj);
			defArr.push(defObj);
		}
		
		if (defArr.length == 0) {
			
			this.start();
		} else {
			
			japa.when.apply(this, defArr).then( japa.proxy( this.start, this ) );
		}
	};
	
	/*
		Loads optional client styles (first element of the array will always be the default client css file)
	*/
	this.appendOptionalStyle = function(sheet, deferred) {

		apa.debug.showInfo( 'Appending optional styles for frame: ' + this.frameId );
			
		var tag = japa( '<style id="apaClientStyle_' + this.frameId + '"></style>' );
		
		japa('head').append( tag );
		
		japa('#apaClientStyle_' + this.frameId).load(sheet, function (responseText, textStatus, req) {

			if (textStatus == 'error') {
				
				console.info('↑↑↑>>> "' + sheet + '" is optional! Ignore the error or create an empty file. <<<↑↑↑' );
			} else {
				
				/* there was a client-stylesheet found, send an append-event to the stylefills-observer */
				
				var tEvent		=	japa.Event( apa.events.stylefills.append );
				tEvent.content	=	sheet;
				
				japa(document).triggerHandler( tEvent );
			}
		});
		
		deferred.resolve();	
	};
	
	/*
		Loads optional client configs (first element of the array will always be the default client config)
	*/
	this.loadOptionalConfig = function(config, deferred) {
		
		var that	=	this;
		var loader	=	new apa.loader.configs.frame();
		var defObj	=	japa.Deferred();
		
		loader.setOptions({
			
			deferred:		defObj,
			url:			config,
			jsonpCallback:	'apaCallbackConfigClient_' + that.frameId
		});
			
		loader.frameId		=	that.frameId;
		loader.load();
		
		japa.when(defObj).then(  function() {

			deferred.resolve();
		});
	};
	
	/*
		Loads optional client scripts (first element of the array will always be the default client script)
	*/
	this.loadOptionalScript = function(script, deferred) {
			
		var loader			=	new apa.loader.scripts();
		var defObj			=	japa.Deferred();

		loader.setOptions({
			
			url:		script,
			deferred:	defObj
		});
		
		loader.load();
		
		japa.when(defObj).then(  function() {

			deferred.resolve();
		});
	};
	
	/*
		Processes the frame-attributes, gets the frame-specific deeplinks and sends an event to the stylefills-observer in order to tell that all possible scripts have been loaded.
		
			When the stylefills-observer is done, this will get a message, initialize the framework controller and hand over the frameId ( e.g. adler1 )
	*/
	this.start = function() {

		apa.debug.showInfo( 'Starting' );
		
		apa.language.set(apa.items[ this.frameId ].config.language, this.frameId);
		
		this.getFrameAttributes();	
		
		apa.url.getFrameParams(this.frameId);
		
		this.observers();
		
		var that = this;
		
		japa(document).one( apa.events.stylefills.setupDone, function() {
					
			var framework = that.getFramework(that.frameId);
			
			framework.init();
		});
		
		var tEvent = japa.Event( apa.events.stylefills.visualDone );
		japa(document).triggerHandler( tEvent );
	};
	
	// data-attributes that have been put into the frame-tag are checked for relevance and update the frame-specific config
	this.getFrameAttributes = function() {
		
		var that = this;
		
		japa.each( apa.items[ this.frameId ].config.frame, function(key, value) {
			
			if ( key.indexOf('data-') > -1 && key != 'data-package' ) {	// keys that are no data-attributes are left out, data-package does not apply
				
				if ( key === 'data-view') {
					
					var newParams	=	{};
					var tParamsArr	=	value.split('-');		// params split by '-'
					
					japa.each( tParamsArr, function() {
						
						var paramPair = this.split(':');		// the value is split from the key by ':'
						
						newParams[ paramPair[0].toString() ] = paramPair[1].toString();
					});
					
					japa.extend( apa.items[ that.frameId ].config.view, newParams );
				} else {
					
					var tOk			=	true;
					var tKeyArr		=	key.replace('data-', '').split('-');
					var tVar		=	apa.items[ that.frameId ].config;
					
					japa.each( tKeyArr, function() {
						
						if ( tVar.hasOwnProperty( this ) ) {
							
							tVar		=	tVar[this];
						} else {
							
							tOk = false;
							return false;
						}
					});
					
					if (tOk) {
						
						var tValue	= that.getVal( value );
						var tObj	= apa.items[ that.frameId ].config;
						
						for( var i = 0; i < tKeyArr.length - 1; i++) {
							
							tObj	=	tObj[ tKeyArr[i] ];	
						}
						
						tObj[ tKeyArr[tKeyArr.length - 1] ] = tValue;
					}
				}
			}
		});
	};
	
	this.getVal = function(value) {
		
		if (value.indexOf(',') > -1) {		// value is an array
			
			var that		=	this;
			var valArr		=	value.split(',');
			var returnArr	=	[];
			
			japa.each( valArr, function() {
				
				returnArr.push( that.getValType( this ) );
			});
			
			return returnArr;
		}
		
		return this.getValType(value);
	};
	
	this.getValType = function(value) {
		
		if ( !isNaN(value) ) {
			
			value = parseFloat( value );
			
			if ( value%1 === 0 ) {
				
				value = parseInt(value, 10);
			}
			
			return value;
			
		} else {
			
			if ( value === 'true' ) {
				
				return true;	
			} else if ( value === 'false' ) {
				
				return false;	
			} 
			
			return value;
		}
	};
		
	/*
		We have to pass the frameId to the framework controller	
	*/
	this.getFramework = function() {				
		
		apa.debug.showError( 'init.getFramework has to be extended' );
	};
});