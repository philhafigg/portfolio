apa.namespace.extend( 'url', {
	
	/*
		Returns URL vars.
		@param name is the var we want to get. If not specified, an array of all vars is returned.
		@returns a var we want to get or an array of all vars
		
		remarks: There is no special test for this method. It has already been "tested" through various implementations in "real life" of 2010/11
	*/
	getVars: function(name) {
	
		var vars	=	{};
		var hashes	=	window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		
		for(var i = 0; i < hashes.length; i++) {
		
			var hash		=	hashes[i].split('=');
			vars[hash[0]]	=	hash[1];
		}
		
		if (name) {
		
			return vars[name];
		} else {
		
			return vars;
		}
	},		
	
	/*
		Sets all URL-vars that are considered appropriate for all visuals that have the same name (e.g wahlen):
			
				e.g:	if we have apa.config.section defined and the URL-vars contain 'apaSection' the contents of the url-var overwrites the apa.config - parameter.
				
		USAGE: define startup-params via the URL (which page of a tool to start,...)
	*/
	
	getOverallParams: function(visuals) {
		
		var urlVars = this.getVars();
	
		japa.each( urlVars, function(key, value) {
				
			if ( !key.split('_')[1] ) {							// params that split with _ are frame-specific and are ignored in the overall-Params;
				
				japa.each(visuals, function() {
					
					if ( key.indexOf('apaview') > -1) {			// only changing the view-params is allowed via url												
						var newParams	=	{};
						var tParamsArr	=	value.split('-');		// params are split by '-'
						
						japa.each( tParamsArr, function() {
							
							var paramPair = this.split(':');		// the value is split from the key by ':'
							
							newParams[ paramPair[0].toString() ] = paramPair[1].toString();
						});
						
						japa.extend( apa.visual[ this ].config.view, newParams );					
					} 
				});
			}
		});
	},
	
	getFrameParams: function(frameId) {
		
		var urlVars = this.getVars();
		
		japa.each( urlVars, function(key, value) {
			
			if ( key == ( 'apaview_' + frameId ) ) {		// only changing the view-params is allowed via url	, this time we take only frame-specific params
				
				var newParams	=	{};
				var tParamsArr	=	value.split('-');		// params are split by '-'
				
				japa.each( tParamsArr, function() {
					
					var paramPair = this.split(':');		// the value is split from the key by ':'
					
					newParams[ paramPair[0].toString() ] = paramPair[1].toString();
				});
				
				japa.extend( apa.items[ frameId ].config.view, newParams );
			}
		});
	}
});