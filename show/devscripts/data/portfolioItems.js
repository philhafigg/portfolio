brain.namespace.extend( 'visual.show.data.portfolioItems', function() {
	
	$.extend( this, new brain.data() );
	
	this.id	= 'portfolioItems';
	
	this.getUrl = function() {
		
		var paths = brain.visual[ this.namespace ].config.paths;
		
		return paths.content + 'items/portfolioItems.json.js';
	};
	
	this.getAdditionalOptions = function(tSubId) {
						
		return {						
			
			crossdomain:	true,
			jsonp:			true,
			jsonpCallback:	'portfolioItemsCallback',
			dataType:		'jsonp'
		};
	};
});