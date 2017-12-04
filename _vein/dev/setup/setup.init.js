japa(document).ready( function() {
	
	new apa.setup.init().start();
});

apa.namespace.extend( 'setup.init', function() {
		
	/*
		At the start of every spine-based application, we need to find out how many apaFrames are declared and to check the device.
		This function initializes the loading process afterwards.
	*/
	this.items		=	[];
	this.visuals	=	[];
	
	this.start = function() {
		
		var that	=	this;
		var defArr	=	[ japa.Deferred(), japa.Deferred(), japa.Deferred(), japa.Deferred() ];

		apa.setup.device.check(defArr[0]);
		this.check(defArr[1]);
		this.createVisuals(defArr[2]);		
		new apa.setup.params().load(defArr[3]);			// load params that may be different in a client implementation
				
		japa.when.apply( this, defArr ).then( function() {
				
			new apa.observer.stylefills().init( that.items.length );
			
			that.load();	
		});
	};
	
	/*
		We need to get the id and the codebase of the apaFrame to push them it into the variable this.items.
		
		The variables
		
			this.items 
			this.visuals
		
		are set here.
	*/
	this.check = function(deferred) {

		var that = this;

		japa('.apaFrame').each( function() {

			var item = {

				id:			( ( japa(this).attr('id') ) ? japa(this).attr('id') : false ),
				codebase:	( ( japa(this).attr('data-package') ) ? japa(this).attr('data-package') : false ),
				namespace:	( ( japa(this).attr('data-package') ) ? japa(this).attr('data-package').split('.')[0] : false ),
			};

			that.items.push( item );
			
			if ( japa.inArray( item.codebase.split('.')[0], that.visuals ) == -1 ) {
				
				that.visuals.push( item.codebase.split('.')[0] );
			}
			
			japa(this).addClass('apa' + apa.formatting.firstUpperCase(item.namespace) );
		});
		
		deferred.resolve();
	};
	
	/*
		We need to create the base namespace in case there are no visuals	
	*/
	this.createVisuals = function(deferred) {
		
		japa.each(this.visuals, function() {
			
			if (!apa.visual[this])						apa.visual[this]						=	{};
			if (!apa.visual[this].config)				apa.visual[this].config					=	{};
			if (!apa.visual[this].config.frame)			apa.visual[this].config.frame			=	{};
			if (!apa.visual[this].config.frameSetting)	apa.visual[this].config.frameSetting	=	false;
		});
		
		deferred.resolve();	
	};
	
	/*
		First Step is to load:
		
			- apa css files
			- apa configs
			- apa packages
	*/
	this.load = function() {
		
		var defArr = [ japa.Deferred(), japa.Deferred(), japa.Deferred() ];
		
		new apa.setup.configs().load(this.visuals, 'apa', defArr[0]);
		new apa.setup.css().append(this.visuals, 'apa', defArr[1]);

		if (apa.params.development) {
			
			defArr[2].resolve();
		} else {
					
			var tPackageSetup = new apa.setup[ 'scripts' ].packages();
			tPackageSetup.load( tPackageSetup.getPackages(this.items), 'apa', defArr[2]);	
		}
		
		japa.when.apply( this, defArr ).then( japa.proxy(this.loadClient, this) );
	};
	
	/*
		Second Step is to load:	
		
			- client css
			- client configs
			- client scripts
	*/
	this.loadClient = function() {
		
		var defArr	=	[ japa.Deferred(), japa.Deferred(), japa.Deferred() ];
		
		new apa.setup.css().append(this.visuals, 'client', defArr[0]);
		new apa.setup.configs().load(this.visuals, 'client', defArr[1]);
		new apa.setup[ 'scripts' ].client().load(this.visuals, 'client', defArr[2]);
		
		japa.when.apply( this, defArr ).then( japa.proxy(this.loadLanguage, this) );
	};
	
	/*
		Third Step is to load the language, we need the apa config and client config to know which language should be loaded	
	*/
	this.loadLanguage = function() {
		
		var defObj = japa.Deferred();
		
		new apa.setup.languages().load(this.visuals, defObj);
		
		japa.when(defObj).then( japa.proxy(this.init, this) );
	};
	
	/*
		Checks url params for visuals and initialization of the items	
	*/
	this.init = function() {
		
		apa.url.getOverallParams(this.visuals);
		
		var tItem	=	new apa.setup.items();
		
		tItem.data	=	this.items;
		tItem.init();	
	};
});