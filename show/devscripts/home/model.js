brain.namespace.extend( 'visual.show.homeItems.model', function(frameId) {
	
	$.extend( this, new brain.model(frameId) );
	
	this.id		=	'homeItems:model';
	
	this.requiredData		=	{ 
		
		0:	[
				[ 'homeItems', false ]
			]
	};
	
	this.processData = function(data, defObj) {

		var that			=	this;
		var tEvents			=	{};
		var config			=	brain.items[ this.frameId ].config;
		
		defObj.resolve();

		return data['homeItems'];
	};
});