brainCallbackConfigShowBrain({
		
	hasheader:	true,						//	do we have the header
	hasnav:		true,						//	do we have the navigation-bar		
	animation:	1,
	language:	'de',
	
	modules: 		[
		
		'portfolio', 'skills', 'profile', 'contact'
	],
	
	view:			{
		
		page:		'home',
		subPage:	''
	},
	
	paths:	{
		
		'images':	'content/images/',
		'content':	'content/'
	},
	
	portfolio: {
		
		sections: ['three', 'develop']
	},
	
	allowMail:	true,
	
	calculatedStyle: 'calcStyle'
});
