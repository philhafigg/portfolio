brain.namespace.extend( 'params', {
	
	development:	false,
	debug:			false,
	version:		'3.0',
	
	timers: {
		
		common:	30000,	
		lazy:	120000,
		live:	5000,	
	},
	
	timestamp:	'sec',			//	default is sec for milliseconds, can be ms, hs, sec, tensec and min
	
	paths: {
		
		'brain': {
			
			language:	'languages',
			script:		'scripts',
			config:		'config',
			css:		'apacss',	
		},
		'client': {
			
			script:		'clientscripts',
			config:		'clientconfig',
			css:		'clientcss'	
		},
		'dev': {
			
			language:	'devlanguages',
			css:		'devcss'
		}	
	},
	
	hasStyleFills:	false				// stylefills don't work in a cross-site-scripting environment, so they have to be avoided
});