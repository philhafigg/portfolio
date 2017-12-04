brain.namespace.extend( 'visual.show.data.profileItems', function() {
	
	$.extend( this, new brain.data() );
	
	this.id	= 'profileItems';
	
	this.getUrl = function() {
		
		var paths = brain.visual[ this.namespace ].config.paths;

		return paths.content + 'items/profileItems.json.js';
	};
	
	this.getAdditionalOptions = function(tSubId) {
						
		return {						
			
			crossdomain:	true,
			jsonp:			true,
			jsonpCallback:	'profileItemsCallback',
			dataType:		'jsonp'
		};
	};
});