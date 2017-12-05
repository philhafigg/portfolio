brain.namespace.extend( 'visual.show.data.scriptsItems', function() {
	
	$.extend( this, new brain.data() );
	
	this.id	= 'scriptsItems';
	
	this.getUrl = function() {
		
		var paths = brain.visual[ this.namespace ].config.paths;
		
		return paths.content + 'items/scriptsItems.json.js';
	};
	
	this.getAdditionalOptions = function(tSubId) {
						
		return {						
			
			crossdomain:	true,
			jsonp:			true,
			jsonpCallback:	'scriptsItemsCallback',
			dataType:		'jsonp'
		};
	};
});