QUnit.module( 'debug' );

QUnit.test( '0: error message in console', function( assert ) {
	
	apa.params.debug = true;
	
	var callback = sinon.spy( console, 'error');

	apa.debug.showError('Testerror');

	assert.ok(callback.called);
	assert.notEqual(callback.args[0][0].indexOf('Testerror'), -1 );

	callback.restore();
	
	apa.params.debug = false;
});

QUnit.test( '1: info message in console', function( assert ) {
	
	apa.params.debug = true;
	
	var callback = sinon.spy( console, 'log');

	apa.debug.showInfo('Testmessage');

	assert.ok(callback.called);
	assert.notEqual(callback.args[0][0].indexOf('Testmessage'), -1 );

	callback.restore();
	
	apa.params.debug = false;
});