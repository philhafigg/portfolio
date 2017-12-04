apa.namespace.extend( 'setup.scripts', function() {
	
	this.options	=	{};
	
	this.load = function(files, type, deferred) {
		
		var that		=	this;
		var defArr		=	[];
			
		japa.each( files, function(key, value) {
			
			var loader			=	that.getLoader();
			var defObj			=	japa.Deferred();
			
			var changedOptions	=	that.options;
			
			changedOptions['url']		=	that.getUrl(type, this);
			changedOptions['deferred']	=	defObj;
					
			defArr.push(defObj);
			
			loader.setOptions( changedOptions );
			loader.load();
		});
		
		japa.when.apply( this, defArr ).then( function() {

			deferred.resolve();	
		});
	};

	this.getLoader = function() {
		
		return new apa.loader['scripts']();	
	};
		
	/*
		Has to be extended	
	*/

	this.getUrl = function(type, name) {};
});