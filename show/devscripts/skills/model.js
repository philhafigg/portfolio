brain.namespace.extend( 'visual.show.skills.model', function(frameId) {
	
	$.extend( this, new brain.model(frameId) );
	
	this.id		=	'skills:model';
	
	this.requiredData		=	{ 
		
		0:	[
				[ 'skillsItems', false ]
			]
	};
	
	this.processData = function(data, defObj) {

		defObj.resolve();

		return data['skillsItems'];
	};
});