apa.namespace.extend( 'data.factory', {
		
	getInstance: function( namespace, dataObject, tId ) {	
				
		var spaceArr		=	dataObject.split('.');
		 
		if ( !apa.data[namespace] ) apa.data[namespace] = {};
		
		var baseObject		=	apa.data[namespace];
		var factoryObject	=	apa.visual[namespace].data;

		for (var i = 0; i < spaceArr.length; i++) {
			
			if ( !baseObject[ spaceArr[i] ] ) baseObject[ spaceArr[i] ] = {};
			
			baseObject		=	baseObject[ spaceArr[i] ];
			factoryObject	=	factoryObject[ spaceArr[i] ];
		}

		if (tId != '') {
		
			if (!baseObject[tId]) {
				
				apa.debug.showInfo( namespace + ': data.' + dataObject + '.' + tId + ' has been created.' );
				
				baseObject[tId]				=	new factoryObject();
				baseObject[tId].namespace	=	namespace;
				baseObject[tId].init(tId);
			} else {
				
				apa.debug.showInfo( namespace + ': data.' + dataObject + '.' + tId + ' already exists.' );
			}
			
			return baseObject[tId];
		} else {
			
			if ( japa.isEmptyObject(baseObject) ) {
				
				apa.debug.showInfo( namespace + ': data.' + dataObject + ' has been created.' );
				
				japa.extend( baseObject, new factoryObject() );
				
				baseObject.namespace		=	namespace;
				baseObject.init('');
			} else {
				
				apa.debug.showInfo( namespace + ': data.' + dataObject + ' already exists.' );
			}
			
			return baseObject;
		}
	}
});