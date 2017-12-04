QUnit.module( 'utils' );

QUnit.test( '0: uniqId', function( assert ) {
	
	assert.equal( apa.utils.uniqId().length, 8, '.uniqId with default-character-length' );
	assert.equal( apa.utils.uniqId(4).length, 4, '.uniqId with 4 characters' );
	assert.equal( apa.utils.uniqId(16).length, 16, '.uniqId with 16 characters' );
});

QUnit.test( '1: getObjectSize', function( assert ) {
	
	var obj1 = {
		
		test:	{
			
			child:	{}
		},
		arr:	[],
		bool:	false
	}
	
	var obj2 = function() {
				
		this.test	=	{};
		this.array	=	[];
		this.bool	=	false;
	}
	
	assert.equal( apa.utils.getObjectSize( obj1 ), 3, 'Object with size = 3' );
	assert.equal( apa.utils.getObjectSize( new obj2() ), 3, 'Function with 3 methods' );
});

