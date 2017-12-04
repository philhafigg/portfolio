brain.namespace.extend( 'visual.show.data.homeItems', function() {
	
	$.extend( this, new brain.data() );
	
	this.id	= 'homeItems';
	
	this.getUrl = function() {
		
		var paths = brain.visual[ this.namespace ].config.paths;
		
		return paths.content + 'items/homeItems.json.js';
	};
	
	this.getAdditionalOptions = function(tSubId) {
						
		return {						
			
			crossdomain:	true,
			jsonp:			true,
			jsonpCallback:	'homeItemsCallback',
			dataType:		'jsonp'
		};
	};
});