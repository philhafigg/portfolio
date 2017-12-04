QUnit.module( 'loader' );

QUnit.test( '0: uniqId', function( assert ) {
	
	var loader = new apa.loader();
	
	var firstString = loader.getId();
	var scndString	= loader.getId();
	
	assert.equal( typeof firstString, 'string', 'id is a string' );
	assert.equal( firstString.indexOf('loader'), 0, 'id is at the beginning' );
	assert.equal( firstString.length, 14, 'id has the right amount of characters' );
	assert.equal( firstString, scndString, 'function always returns the same string' );	
});

QUnit.test( '1: setOptions, get default Options', function( assert ) {
	
	var loader			=	new apa.loader();
	var defOptions		=	japa.extend( true, {}, apa.params.loader['default'] );	

	japa.extend(defOptions, {
		
		beforeSend:		japa.proxy( loader.sendStart,	this ),
		xhr:			japa.proxy( loader.sendProgress, this ),
		error:			japa.proxy( loader.error,	this ),
		complete:		japa.proxy( loader.complete, this ),
	});
	
	loader.setOptions();

	assert.propEqual( loader.options, defOptions, 'default options are passed correctly' );		//	we use propEqual, because deepEqual fails although both objects are the same
});

QUnit.test( '2. setOptions, change Options', function( assert ) {
	
	var loader			=	new apa.loader();
	var changedOptions 	=	{
		
		cache:			true,
		url:			'http://www.example.com',
		hasProgress:	true
	};
	
	loader.setOptions( changedOptions );
	
	assert.deepEqual( loader.options.cache, changedOptions.cache, 'chaching parameter is accepted' );
	assert.deepEqual( loader.options.url, changedOptions.url, 'url parameter is accepted' );
	assert.deepEqual( loader.options.hasProgress, changedOptions.hasProgress, 'hasProgress parameter is accepted' );
});

QUnit.test( '3. cached loading, right URL', function( assert ) {
	
	// sinon setup
	var requests	=	sinon.requests	=	[];	
	var callback	=	sinon.spy();
	var xhr			=	sinon.useFakeXMLHttpRequest();	
	xhr.onCreate	=	function (request) {
		
		requests.push(request);
	};
	
	// loader setup	
	var loader			=	new apa.loader();
	var changedOptions	=	{ url: 'http://www.example.com', cache: true };		// has to be cached otherwise the url will not match
	
	loader.setOptions( changedOptions );
	loader.load();
	
	assert.equal( sinon.requests.length, 1);
	assert.equal( sinon.requests[0].url.split('?')[0], changedOptions.url);
	assert.equal( sinon.requests[0].url.indexOf('callback'), 23);				//	check if requested url contains the string 'callback'
	
	xhr.restore();
});

QUnit.test( '4: loader.items, setOptions, get default Options', function( assert ) {

	var loader = new apa.loader.items();

	var defOptions		=	japa.extend( true, {}, apa.params.loader.items );	
	
	japa.extend(defOptions, {
		
		beforeSend:		japa.proxy( loader.sendStart,	this ),
		xhr:			japa.proxy( loader.sendProgress, this ),
		error:			japa.proxy( loader.error,	this ),
		complete:		japa.proxy( loader.complete, this ),
		success:		japa.proxy( loader.success, this ),
	});

	loader.setOptions();
	
	assert.propEqual( loader.options, defOptions, 'default options are passed correctly' ); 	//	we use propEqual, because deepEqual fails although both objects are the same
});











