brain.namespace.extend( 'visual.show.data.threeItems', function() {
	
	$.extend( this, new brain.data() );
	
	this.id	= 'threeItems';
	
	this.getUrl = function() {
		
		var paths = brain.visual[ this.namespace ].config.paths;
		
		return paths.content + 'items/threeItems.json.js';
	};
	
	this.getAdditionalOptions = function(tSubId) {
						
		return {						
			
			crossdomain:	true,
			jsonp:			true,
			jsonpCallback:	'threeItemsCallback',
			dataType:		'jsonp'
		};
	};
});