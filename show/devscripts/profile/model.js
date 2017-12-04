brain.namespace.extend( 'visual.show.profile.model', function(frameId) {
	
	$.extend( this, new brain.model(frameId) );
	
	this.id		=	'profile:model';
	
	this.requiredData		=	{ 
		
		0:	[
				[ 'profileItems', false ]
			]
	};
	
	this.processData = function(data, defObj) {

		defObj.resolve();

		return data['profileItems'];
	};
});