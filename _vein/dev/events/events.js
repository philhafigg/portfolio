apa.namespace.extend( 'events', {
	
	controller: {
			
		kill:		'controllerKill'
	},
	
	data: {
		
		update:			'dataUpdate',
		manualUpdate:	'dataManualUpdate'
	},
		
	framework: {
			
		done:		'frameworkDone'
	},
		
	loader: {
		
		started:	'loaderStarted',
		ended:		'loaderEnded',
		progress:	'loaderProgress',
		success:	'loaderSuccess',
		error:		'loaderError',
		done:		'loaderDone'
	},

	progress: {
		
		update:		'progressUpdate'	
	},
	
	model: {
			
		get:			'modelGet',
		send:			'modelSend',
		kill:			'modelKill',
		updateModel:	'modelUpdateModel'
	},
		
	site: {
		
		resized:	'siteResized'
	},
		
	updater: {
		
		inform:		'updaterInform'	
	},
	
	clicks: {
		
		done:		'clicksDone'	
	},
	
	stylefills: {
		
		append:			'stylefillsAppend',
		visualDone:		'stylefillsVisualDone',
		checkStyles:	'stylefillsCheckStyles',
		setupDone:		'stylefillsSetupDone'
	}
});