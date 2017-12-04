apa.namespace.extend( 'params', {
	
	loader: {
	
		'default': {
			
			dataType:		'jsonp',
			cache:			false,
			async:			true,
			crossDomain:	false,
			timeout:		60000,
			type:			'GET',
			url:			'',
			hasProgress:	false
		},
		'items': {
			
			dataType:		'script',
			cache:			true,
			async:			true,
			crossDomain:	true,
			timeout:		60000,
			type:			'GET',
			url:			'',
			hasProgress:	false
		},
		'language': {
			
			dataType:		'jsonp',
			cache:			true,
			async:			true,
			crossDomain:	true,
			timeout:		30000,
			type:			'GET',
			url:			'',
			hasProgress:	false
		},
		'scripts': {
			
			dataType:		'script',
			cache:			true,
			async:			true,
			crossDomain:	true,
			timeout:		60000,
			type:			'GET',
			url:			'',
			hasProgress:	false
		},
		'configs': {
			
			dataType:		'jsonp',
			cache:			true,
			async:			true,
			crossDomain:	true,
			timeout:		60000,
			type:			'GET',
			url:			'',
			hasProgress:	false
		}
	}
});	

