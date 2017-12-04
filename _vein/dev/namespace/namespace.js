var apa = {

	namespace: function() {

		// build the basic namespaces that are not built by spine-components
		japa.extend( apa, {

			data:		{},
			device:		{},
			items:		{},
			visual:		{},
			language:	{}
		});

		this.extend = function(spaces, objectToAdd) {

			var spacesArr	=	spaces.split('.');
			var space		=	apa;

			for ( var i = 0, tLength = spacesArr.length; i < tLength; i++ ) {

				var tSpace = spacesArr[i];

				if ( !space[tSpace] ) space[tSpace] = {};

				if ( i == tLength - 1) {

					japa.extend( objectToAdd, space[tSpace] );
					
					space[tSpace] = objectToAdd;
				} else {
					
					space = space[tSpace];
				}
			}
		};
	}
};

apa.namespace = new apa.namespace();
