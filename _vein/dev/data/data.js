apa.namespace.extend( 'data', function() {
				
	this.id						=	'data';
	this.subId					=	false;
	this.content				=	{};
	this.loading				=	false;
	this.loader					=	false;
	this.used					=	0;
	this.lastUpdate				=	0;
	this.namespace				=	false;			// Has to be passed from factory when instance is created
	this.hasProgress			=	false;
	this.hasPeriodicalUpdates	=	false;			// when an object has to reload periodically, this has to be true;
	this.timer					=	false;
	
	this.init = function(tSubId) {
		
		this.id		+=	tSubId;
		this.subId	=	tSubId;
		this.loader	=	this.getLoader();
		
		this.loader.setOptions( {
			
			url:		this.getUrl(tSubId),
			success:	japa.proxy( this.process, this )
		});

		if (this.hasProgress) {

			this.loader.options.hasProgress = true;
		}
		
		japa.extend( this.loader.options, this.getAdditionalOptions(tSubId) );
		
		this.bindEvents();
	};
	
	this.getAdditionalOptions = function(tSubId) {
		
		// Normally this is empty, if something other that default-json is required, we can return an object here
	};
	
	this.bindEvents = function() {
		
		var baseId = this.id.replace(this.subId, '');
		
		japa(document).on(this.namespace + apa.events.updater.inform, japa.proxy( this.checkUpdate, this ) );
		japa(document).on(this.namespace + apa.events.data.manualUpdate + baseId, japa.proxy( this.manualUpdate, this ) );
		
		if (this.hasProgress) {

			japa(document).on( apa.events.loader.started + this.loader.getId(), japa.proxy( this.startProgress, this ) );			
			japa(document).on( apa.events.loader.progress + this.loader.getId(), japa.proxy( this.refreshProgress, this ) );
			japa(document).on( apa.events.loader.ended + this.loader.getId(), japa.proxy( this.endProgress, this ) );
		}
	};
	
	this.startProgress = function(event) {

		apa.progress.start(this.namespace, this.id);
	};
	
	this.refreshProgress = function(event) {
		
		apa.progress.calculate(this.namespace, this.id, event.content);
	};
	
	this.endProgress = function(event) {
		
		apa.progress.end(this.namespace, this.id);
	};
	
	/*
		After successfully loading the data, this function appends a current timestamp to the data object
	*/
	this.process = function(data, textStatus, jqXHR) {
								
		this.content = data;
		
		if (!this.lastUpdate) this.lastUpdate = new Date().getTime();
		
		this.send();
	};
	
	/*
		Sends the data to the model	which asks for it
	*/
	this.send = function() {		

		apa.debug.showInfo(this.namespace + ': Sending data ' + this.id);				
		
		this.loading = false;
		
		var tEventString	=	this.namespace + apa.events.data.update + this.id;						
		var tEvent			=	japa.Event( tEventString );
		tEvent.content		=	this.content;
		tEvent.lastUpdate	=	this.lastUpdate;
		tEvent.dataId		=	this.id;
		tEvent.callback		=	this.loader.options.jsonpCallback;
		
		japa(document).triggerHandler( tEvent );
		
		if (this.hasPeriodicalUpdates) {
			
			this.setNextUpdate();
		}
	};
	
	this.setNextUpdate = function() {
		
		var that = this;
		
		if (!this.timer) {
		
			this.timer = window.setTimeout( function() {
				
				that.manualUpdate();
				that.timer = false;
			}, this.getUpdateInterval() );
		}
	};
	
	this.getUpdateInterval = function() {
		
		return apa.params.timers.common;
	};
	
	this.manualUpdate = function() {
				
		if (this.used > 0) {
				
			this.lastUpdate	=	new Date().getTime();
			this.loading	=	true;
						
			this.loader.load();
		} else {
			
			this.content = {};
			this.lastUpdate = 0;
		}
	};
	
	this.get = function() {
		
		if (!this.loading) {
			
			if ( this.hasContent() ) {
				
				this.send();
			} else {
				
				this.update();	
			}								
		}
	};
	
	this.update = function() {
		
		if (this.used > 0) {
			
			apa.debug.showInfo(this.namespace + ': Loading ' + this.id);

			this.loading = true;
			
			this.loader.load();
		} else {								// this case cannot occur if we come from get, only from the live-updater
			
			this.content = {};
			this.lastUpdate = 0;
		}
	};
	
	this.checkUpdate = function(tData) {
		
		if ( tData.content.hasOwnProperty( this.id ) ) {
			
			var tLastUpdate = tData.content[this.id].lastUpdate;
			
			if (tLastUpdate != this.lastUpdate) {
				
				this.update();
				
				this.lastUpdate = tLastUpdate;
			}
		}
	};
	
	this.hasContent = function() {

		if ( japa.isEmptyObject( this.content ) ) {
			
			return false;
		} else if ( this.lastUpdate + apa.params.timers.common < new Date().getTime() ) {
			
			return false;
		}
		
		return true;
	};
	
	this.addUser = function() {
			
		this.used++;	
	};
							
	this.removeUser = function() {
		
		this.used--;						
	};
	
	/*
		Can be extended if needed		
	*/
	this.getLoader = function() {
		
		return new apa.loader();
	};
	
	this.getUrl = function(tSubId) {
		
		apa.debug.showError( '.getUrl has to be extended in ' + this.id );
	};
});