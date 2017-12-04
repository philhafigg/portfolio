brain.namespace.extend( 'visual.show.scripts.model', function(frameId) {
	
	$.extend( this, new brain.model(frameId) );
	
	this.id		=	'scripts:model';
	
	this.requiredData		=	{ 
		
		0:	[
				[ 'scriptsItems', false ]
			]
	};
	
	this.processData = function(data, defObj) {

		var that			=	this;
		var tEvents			=	{};
		var config			=	brain.items[ this.frameId ].config;
		
		this.assignId(data['scriptsItems']);
		
		defObj.resolve();

		return data;
	};
	
	this.assignId	=	function(data) {
		
		var tCount	=	0;
		
		$.each(data, function() {
			
			this.id	=	'item_' + tCount;
			
			tCount++;
		});
	};
});