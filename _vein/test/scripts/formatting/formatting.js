QUnit.module( 'formatting' );

QUnit.test( '0: getPrettyNumber - Integer, no rounding', function( assert ) {
	
	assert.equal( apa.formatting.getPrettyNumber( 52220000 ), '52,220,000' , 'Default - English');
	assert.equal( apa.formatting.getPrettyNumber( 52220000, 'deu' ), '52.220.000' , 'German');
	assert.equal( apa.formatting.getPrettyNumber( 52220000, 'gsw' ), '52\'220\'000' , 'Swiss-German');
});

QUnit.test( '1: getPrettyNumber - Integer, rounded', function( assert ) {
	
	assert.equal( apa.formatting.getPrettyNumber( 52220000, 'eng', 2 ), '52,220,000.00' , 'English');
	assert.equal( apa.formatting.getPrettyNumber( 52220000, 'deu', 2 ), '52.220.000,00' , 'German');
	assert.equal( apa.formatting.getPrettyNumber( 52220000, 'gsw', 2 ), '52\'220\'000.00' , 'Swiss-German');
});

QUnit.test( '2: getPrettyNumber - Float, no rounding', function( assert ) {
	
	assert.equal( apa.formatting.getPrettyNumber( 52220000.1234 ), '52,220,000.1234' , 'Default - English');
	assert.equal( apa.formatting.getPrettyNumber( 52220000.1234, 'deu' ), '52.220.000,1234' , 'German');
	assert.equal( apa.formatting.getPrettyNumber( 52220000.1234, 'gsw' ), '52\'220\'000.1234' , 'Swiss-German');
});

QUnit.test( '3: getPrettyNumber - Float, rounded to 2', function( assert ) {
	
	assert.equal( apa.formatting.getPrettyNumber( 52220000.529, 'eng', 2 ), '52,220,000.53' , 'English');
	assert.equal( apa.formatting.getPrettyNumber( 52220000.529, 'deu', 2 ), '52.220.000,53' , 'German');
	assert.equal( apa.formatting.getPrettyNumber( 52220000.529, 'gsw', 2 ), '52\'220\'000.53' , 'Swiss-German');
});

QUnit.test( '4: getPrettyNumber - Integer, no rounding, string is appended to country-code', function( assert ) {
	
	assert.equal( apa.formatting.getPrettyNumber( 52220000, 'deu_tt.com' ), '52.220.000' , 'works');
});

QUnit.test( '5: firstUpperCase', function( assert ) {
	
	assert.equal( apa.formatting.firstUpperCase( 'test.\|\'123' ), 'Test.\|\'123', 'String with special charts, lowerCase' );
	assert.equal( apa.formatting.firstUpperCase('TEST'), 'Test', 'String all uppercase' );
	assert.equal( apa.formatting.firstUpperCase('TestString'), 'Teststring', 'String in camel-case' );
	assert.equal( apa.formatting.firstUpperCase('1TestString'), '1teststring', 'Number as first char, String in camel-case' );
	assert.equal( apa.formatting.firstUpperCase('.TestString'), '.teststring', 'Special-character as first char, String in camel-case' );	
});