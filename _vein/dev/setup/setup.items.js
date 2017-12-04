apa.namespace.extend( 'setup.items', function() {

	this.data = [];

	this.init = function() {

		var defArr			=	[ japa.Deferred(), japa.Deferred() ];
		
		this.setItemSpace( defArr[0] );
		this.updateCodeBase( defArr[1] );
		
		japa.when.apply( this, defArr ).then( japa.proxy(this.start, this) );
	};
	/*
		Depending on the id's of the apaFrames, this function creates the namespaces ( e.g. apa.items.adler1 ) which are nessecary for the configs of the items
	*/
	this.setItemSpace = function(deferred) {
		
		japa.each( this.data, function() {
			
			apa.namespace.extend( 'items.' + this.id, {} );
		});
		
		deferred.resolve();
	};
	
	/*
		Passing trough the this.data array to redefine the codebases by attaching the string "apa.visual." before the codebase and reducing the codebase to the first element ( e.g. sport.tables.ranking leads to apa.visual.sport )
	*/
	this.updateCodeBase = function(deferred) {
		
		japa.each( this.data, function() {
					
			this.codebase	=	'apa.visual.' + this.namespace;
		});
		
		deferred.resolve();
	};

	/*
		Checks the apaFrames for attributes and writes them to the related config ( e.g. apa.items.adler1.config ).
		We also need to hand over the frameId ( e.g. adler1 ) to the init of the codebases, because every spine-based application needs to have access to the related config. 
		Initializes the codebases of this.data ( e.g. apa.visual.sport.init, apa.visual.wahlen.init ).
	*/
	this.start = function() {

		japa.each( this.data, function() {

			var tConfig			=	{};
			tConfig.frame		=	{};
			
			japa.each(japa('#' + this['id']).get(0).attributes, function(key, attribute){
			
				tConfig.frame[attribute.name] = attribute.value;
			});
			
			tConfig.codebase	=	this.codebase;
			tConfig.namespace	=	this.namespace;
			
			apa.items[ this.id ].config = tConfig;

			var tPackage = apa;
			
			japa.each( this.codebase.split('.'), function(key, value) {
				
				if (key != 0) {
					
					tPackage =  tPackage[ '' + this ];	
				}
			});
			
			if (!tPackage.init) {
				
				apa.debug.showError( 'Package ' + this.namespace + ' has no init() function defined' );				
			} else {

				var tInit = new tPackage.init();
				
				tInit.frameId	=	this['id'];
				tInit.namespace	=	this.namespace;
				tInit.configure();
			}
		});
	};
});





