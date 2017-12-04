apa.namespace.extend( 'setup.configs', function() {
	
	var data;
	
	this.options = {};
	
	this.getUrl = function(type, name) {
		
		return apa.params.paths[ type ].config + '/' + type + '.' + name + '.config.js';
	};
	
	this.getLoader = function() {
		
		return new apa.loader.configs();	
	};
	
	this.load = function(files, type, deferred) {
		
		var that		=	this;
		var defArr		=	[];
			
		japa.each( files, function(key, value) {
			
			var loader			=	that.getLoader();
			var defObj			=	japa.Deferred();
			
			var changedOptions	=	that.options;
			
			changedOptions['url']				=	that.getUrl(type, this);
			changedOptions['jsonpCallback']		=	'apaCallbackConfig' + apa.formatting.firstUpperCase(value) + apa.formatting.firstUpperCase(type);	
			changedOptions['deferred']			=	defObj;

			defArr.push(defObj);
			
			loader.namespace	=	value;
			loader.setOptions( changedOptions );
			
			loader.load();
		});
		
		japa.when.apply( this, defArr ).then( function() {

			deferred.resolve();	
		});
	};
});