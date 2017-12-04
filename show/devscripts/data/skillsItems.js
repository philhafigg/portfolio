brain.namespace.extend( 'visual.show.data.skillsItems', function() {
	
	$.extend( this, new brain.data() );
	
	this.id	= 'skillsItems';
	
	this.getUrl = function() {
		
		var paths = brain.visual[ this.namespace ].config.paths;

		return paths.content + 'items/skillsItems.json.js';
	};
	
	this.getAdditionalOptions = function(tSubId) {
						
		return {						
			
			crossdomain:	true,
			jsonp:			true,
			jsonpCallback:	'skillsItemsCallback',
			dataType:		'jsonp'
		};
	};
});