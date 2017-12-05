brain.namespace.extend( 'visual.show.portfolio.develop.model', function(frameId) {
	
	$.extend( this, new brain.model(frameId) );
	
	this.id		=	'portfolio:develop:model';
	
	this.requiredData		=	{ 
		
		0:	[
				[ 'developItems', false ]
			]
	};
	
	this.processData = function(data, defObj) {

		var that			=	this;
		var tEvents			=	{};
		var config			=	brain.items[ this.frameId ].config;
		
		data = this.assignId(data['developItems']);
		
		defObj.resolve();

		return data;
	};
	
	this.assignId	=	function(data) {
		
		var tCount	=	0;
		
		$.each(data, function() {
			
			this.id	=	'item_' + tCount;
			
			tCount++;
		});
		
		return data;
	};
});