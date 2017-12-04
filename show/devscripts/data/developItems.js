brain.namespace.extend( 'visual.show.data.developItems', function() {
	
	$.extend( this, new brain.data() );
	
	this.id	= 'developItems';
	
	this.getUrl = function() {
		
		var paths = brain.visual[ this.namespace ].config.paths;
		
		return paths.content + 'items/developItems.json.js';
	};
	
	this.getAdditionalOptions = function(tSubId) {
						
		return {						
			
			crossdomain:	true,
			jsonp:			true,
			jsonpCallback:	'developItemsCallback',
			dataType:		'jsonp'
		};
	};
});