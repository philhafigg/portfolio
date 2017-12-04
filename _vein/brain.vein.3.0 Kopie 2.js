var brain = {

	namespace: function() {

		// build the basic namespaces that are not built by vein-components
		$.extend( brain, {

			data:		{},
			device:		{},
			items:		{},
			visual:		{},
			language:	{}
		});

		this.extend = function(spaces, objectToAdd) {

			var spacesArr	=	spaces.split('.');
			var space		=	brain;

			for ( var i = 0, tLength = spacesArr.length; i < tLength; i++ ) {

				var tSpace = spacesArr[i];

				if ( !space[tSpace] ) space[tSpace] = {};

				if ( i == tLength - 1) {

					$.extend( objectToAdd, space[tSpace] );
					
					space[tSpace] = objectToAdd;
				} else {
					
					space = space[tSpace];
				}
			}
		};
	}
};

brain.namespace = new brain.namespace();
brain.namespace.extend( 'controller.framework', function(frameId) {
	
	$.extend( this, new brain.controller(frameId) );
						
	this.idPrefix	=	'controller:framework';
	this.frameId	=	frameId;					// has to be passed from init
	
	this.init = function(container) {
		
		brain.debug.showInfo( '#' + this.frameId + ': Initializing ' + this.id );
						
		this.bindEvents();
		
		if (!container) container = '';
			
		this.container = '#' + this.frameId + ' ' + container;
		
		this.getData();
		
		var tEvent = $.Event( this.frameId + brain.events.framework.done );
		
		$(document).triggerHandler( tEvent );
	};
});
brain.namespace.extend( 'controller', function(frameId) {
	
	this.frameId		=	frameId;				
	this.idPrefix		=	'controller';
	this.id				=	'';
	this.model			=	false;
	this.initialized	=	false;
	
	this.parent = {
		
		init: function(container) {
			
			brain.debug.showInfo( '#' + this.frameId + ': Initializing ' + this.id );
			
			if (!container) container = '';
			
			this.container = '#' + this.frameId + ' ' + container;
			
			this.bindEvents();
			
			this.getData();
			
			return this.id;
		},
		
		bindEvents: function() {
			
			if (this.model) {
				
				$(document).on( this.frameId + brain.events.model.send + this.model, $.proxy( this.checkView, this ) );
			}
			
			$(document).on( this.frameId + brain.events.controller.kill + this.id, $.proxy( this.kill, this ) );
		},
		
		kill: function() {
			
			brain.debug.showInfo('#' + this.frameId + ': Killing controller ' + this.id);
			
			$(document).off( this.frameId + brain.events.model.send + this.model, $.proxy( this.checkView, this ) );
			
			if (this.model) {
							
				var tEvent = $.Event( this.frameId + brain.events.model.kill + this.model );
				
				$(document).triggerHandler(tEvent);
				
				this.model = false;
			}
			
			$(document).off( this.frameId + brain.events.controller.kill + this.id, $.proxy( this.kill, this ) );
		},
		
		checkView: function(ev) {
			
			if (this.initialized) {
				
				this.update(ev);
			} else {
			
				brain.debug.showInfo('#' + this.frameId + ': Rendering view for ' + this.id);
				
				this.render(ev);
			}
		},
	
		render: function(ev) {
			
			this.initialized	=	true;
			var content			=	false;
			
			if (ev) content = ev.content;
			
			var view = this.view();
			
			view.frameId = this.frameId;
			
			$(this.container).html( view.get( content ) );
			
			var tEvent = $.Event( brain.events.stylefills.checkStyles );
		
			$(document).triggerHandler( tEvent );
		},
		
		update: function(ev) {
			
			// default does nothing as we don't assume that this is a live-controller.
		},
	
		getData: function() {
			
			if (this.model != false) {
				
				var tModelArr = this.model.split(':');
				
				var tObj = brain.visual[ brain.items[ this.frameId ].config.namespace ];
				
				$.each( tModelArr, function() {
					
					tObj = tObj['' + this];
				});
				
				var tModel = new tObj(this.frameId);
				
				tModel.init();
				
			} else {
				
				this.render();
			}
		}
	};
	
	this.init			=	this.parent.init;
	this.bindEvents		=	this.parent.bindEvents;
	this.kill			=	this.parent.kill;
	this.checkView		=	this.parent.checkView;
	this.render			=	this.parent.render;
	this.update			=	this.parent.update;
	this.getData		=	this.parent.getData;
	
	this.view = function(data) {
		
		brain.debug.showError( '.getView has to be extended in ' + this.id );
	};
});	
brain.namespace.extend( 'data', function() {
				
	this.id						=	'data';
	this.subId					=	false;
	this.content				=	{};
	this.loading				=	false;
	this.loader					=	false;
	this.used					=	0;
	this.lastUpdate				=	0;
	this.namespace				=	false;			// Has to be passed from factory when instance is created
	this.hasProgress			=	false;
	this.timer					=	false;
	
	this.init = function(tSubId) {
		
		this.id		+=	tSubId;
		this.subId	=	tSubId;
		this.loader	=	this.getLoader();
		
		this.loader.setOptions( {
			
			url:		this.getUrl(tSubId),
			success:	$.proxy( this.process, this )
		});

		if (this.hasProgress) {

			this.loader.options.hasProgress = true;
		}
		
		$.extend( this.loader.options, this.getAdditionalOptions(tSubId) );
		
		this.bindEvents();
	};
	
	this.getAdditionalOptions = function(tSubId) {
		
		// Normally this is empty, if something other that default-json is required, we can return an object here
	};
	
	this.bindEvents = function() {
		
		var baseId = this.id.replace(this.subId, '');
		
		$(document).on(this.namespace + brain.events.updater.inform, $.proxy( this.checkUpdate, this ) );
		$(document).on(this.namespace + brain.events.data.manualUpdate + baseId, $.proxy( this.manualUpdate, this ) );
		
		if (this.hasProgress) {

			$(document).on( brain.events.loader.started + this.loader.getId(), $.proxy( this.startProgress, this ) );			
			$(document).on( brain.events.loader.progress + this.loader.getId(), $.proxy( this.refreshProgress, this ) );
			$(document).on( brain.events.loader.ended + this.loader.getId(), $.proxy( this.endProgress, this ) );
		}
	};
	
	this.startProgress = function(event) {

		brain.progress.start(this.namespace, this.id);
	};
	
	this.refreshProgress = function(event) {
		
		brain.progress.calculate(this.namespace, this.id, event.content);
	};
	
	this.endProgress = function(event) {
		
		brain.progress.end(this.namespace, this.id);
	};
	
	/*
		After successfully loading the data, this function appends a current timestamp to the data object
	*/
	this.process = function(data, textStatus, jqXHR) {
								
		this.content = data;
		
		if (!this.lastUpdate) this.lastUpdate = new Date().getTime();
		
		this.send();
	};
	
	/*
		Sends the data to the model	which asks for it
	*/
	this.send = function() {		

		brain.debug.showInfo(this.namespace + ': Sending data ' + this.id);				
		
		this.loading = false;
		
		var tEventString	=	this.namespace + brain.events.data.update + this.id;						
		var tEvent			=	$.Event( tEventString );
		tEvent.content		=	this.content;
		tEvent.lastUpdate	=	this.lastUpdate;
		tEvent.dataId		=	this.id;
		tEvent.callback		=	this.loader.options.jsonpCallback;
		
		$(document).triggerHandler( tEvent );
	};
	
	this.manualUpdate = function() {
				
		if (this.used > 0) {
				
			this.lastUpdate	=	new Date().getTime();
			this.loading	=	true;
						
			this.loader.load();
		} else {
			
			this.content = {};
			this.lastUpdate = 0;
		}
	};
	
	this.get = function() {
		
		if (!this.loading) {
			
			if ( this.hasContent() ) {
				
				this.send();
			} else {
				
				this.update();	
			}								
		}
	};
	
	this.update = function() {
		
		if (this.used > 0) {
			
			brain.debug.showInfo(this.namespace + ': Loading ' + this.id);

			this.loading = true;
			
			this.loader.load();
		} else {								// this case cannot occur if we come from get, only from the live-updater
			
			this.content = {};
			this.lastUpdate = 0;
		}
	};
	
	this.checkUpdate = function(tData) {
		
		if ( tData.content.hasOwnProperty( this.id ) ) {
			
			var tLastUpdate = tData.content[this.id].lastUpdate;
			
			if (tLastUpdate != this.lastUpdate) {
				
				this.update();
				
				this.lastUpdate = tLastUpdate;
			}
		}
	};
	
	this.hasContent = function() {

		if ( $.isEmptyObject( this.content ) ) {
			
			return false;
		} else if ( this.lastUpdate < new Date().getTime() ) {
			
			return false;
		}
		
		return true;
	};
	
	this.addUser = function() {
			
		this.used++;	
	};
							
	this.removeUser = function() {
		
		this.used--;						
	};
	
	/*
		Can be extended if needed		
	*/
	this.getLoader = function() {
		
		return new brain.loader();
	};
	
	this.getUrl = function(tSubId) {
		
		brain.debug.showError( '.getUrl has to be extended in ' + this.id );
	};
});
brain.namespace.extend( 'data.factory', {
		
	getInstance: function( namespace, dataObject, tId ) {	
				
		var spaceArr		=	dataObject.split('.');
		 
		if ( !brain.data[namespace] ) brain.data[namespace] = {};
		
		var baseObject		=	brain.data[namespace];
		var factoryObject	=	brain.visual[namespace].data;

		for (var i = 0; i < spaceArr.length; i++) {
			
			if ( !baseObject[ spaceArr[i] ] ) baseObject[ spaceArr[i] ] = {};
			
			baseObject		=	baseObject[ spaceArr[i] ];
			factoryObject	=	factoryObject[ spaceArr[i] ];
		}

		if (tId != '') {
		
			if (!baseObject[tId]) {
				
				brain.debug.showInfo( namespace + ': data.' + dataObject + '.' + tId + ' has been created.' );
				
				baseObject[tId]				=	new factoryObject();
				baseObject[tId].namespace	=	namespace;
				baseObject[tId].init(tId);
			} else {
				
				brain.debug.showInfo( namespace + ': data.' + dataObject + '.' + tId + ' already exists.' );
			}
			
			return baseObject[tId];
		} else {
			
			if ( $.isEmptyObject(baseObject) ) {
				
				brain.debug.showInfo( namespace + ': data.' + dataObject + ' has been created.' );
				
				$.extend( baseObject, new factoryObject() );
				
				baseObject.namespace		=	namespace;
				baseObject.init('');
			} else {
				
				brain.debug.showInfo( namespace + ': data.' + dataObject + ' already exists.' );
			}
			
			return baseObject;
		}
	}
});
brain.namespace.extend( 'debug', {
	
	showError: function(msg) {
		
		if (brain.params.debug) {
			
			if (typeof console !== "undefined") {
					
				if (typeof console.log !== "undefined") {
			
					console.error('ERROR: ' + msg);
				}
			}
		}
	},
	
	showInfo: function(msg) {
		
		if (brain.params.debug) {
			
			if (typeof console !== "undefined") {
					
				if (typeof console.log !== "undefined") {
			
					console.log('INFO: ' + msg);
				}
			}
		}
	}
});
brain.namespace.extend( 'events', {
	
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
brain.namespace.extend( 'formatting', {
				
	/*
		Returns a (country-specific) pretty formatted and rounded number.
		
			Defaults are for English, other values have to be passed.
	*/
	getPrettyNumber: function(number, country, round) {

		var del			=	',';
		var dec			=	'.';
		var output		=	'';
		
		if ( country && country.indexOf('deu') > -1 ) {
			
			del = '.';
			dec = ',';
		}
		
		if ( country && country.indexOf('gsw') > -1 ) {
			
			del = '\'';
		}
		
		if (round > 0) {
			
			number = parseFloat(number).toFixed(round);
		}
	
		var numString	=	'' + number;		
		var tMinus		=	false;
		
		if (numString.substr(0, 1) == '-') {
			
			numString = numString.substr(1, numString.length);
			tMinus = true;
		}		
		
		numString = numString.split('.');
		
		if ( numString[0].length > 3 ) {
			
			var mod	=	numString[0].length % 3;
			output	=	( mod > 0 ? (numString[0].substr( 0, mod ) ) : '' );
			
			for (var i = 0 ; i < Math.floor( numString[0].length/3 ); i++) {
				
				if ( (mod === 0) && (i === 0) ) {
					
					output += numString[0].substring( mod + 3 * i, mod + 3 * i + 3);
				} else {
					
					output += del + numString[0].substring(mod + 3 * i, mod + 3 * i + 3);
				}
			}
		} else {
			
			output = numString[0];
		}
		
		if (numString.length > 1) {
			
			output += dec + numString[1];
		}
		
		if (tMinus) {
			
			output = '-' + output;
		}
		
		return output;
	},
	
	/*
		Writes the first letter of a string in uppercase, the rest in lowercase
		
			@param		is the string we want to modify
			@returns	the modified string or false if there was no string passed.
	*/
	firstUpperCase: function(tString) {
		
		if ( typeof(tString) == 'string') {
						
			tString = tString.toLowerCase();
			
			return tString.replace( /^./, tString[0].toUpperCase() );
		}
		
		return false;
	}
});
brain.namespace.extend( 'init', function() {
	
	this.frameId	=	false;
	this.namespace	=	false;
	
	/*
		Configuration for every vein-based application.
		
		1.) Extract params of the url
		2.) Font.stylefill
		3.) Initializes observers
		4.) In case the client wants to customize individual frames, the param frameSetting has to be an array containing the settings for the frameID in the config in the client.config
	*/
	this.configure = function() {
		
		brain.debug.showInfo( 'Configuring' );

		this.cloneConfig();
			
		this.start();
	};
	
	/*
		Initializes the observer of the application, e.g. brain.visual.sport.observer.
		In case we dont have an observer defined, this function won't throw an error.
	*/
	this.observers = function() {
		
		var that = this;

		brain.debug.showInfo( 'Initializing observers' );
		
		if (!brain.items[ this.frameId ].config.codebase) {
		
			brain.debug.showError( 'There is no app-namespace defined' );
		} else {
			
			var codebase = this.namespace;
			
			if ( brain.visual[ codebase ].observer ) {

				$.each( brain.visual[ codebase ].observer, function() {
					
					var tObserver = new this();
					
					tObserver.namespace	=	that.namespace;
					tObserver.frameId	=	that.frameId;
					
					tObserver.init();
				});	
			}
		}
	};
	
	/*
		Every frame needs its own config, therefore we need to clone the visual config into the items	
	*/
	this.cloneConfig = function() {
		
		var clonedConfig	=	$.extend( true, {}, brain.visual[ this.namespace ].config );
		
		$.extend( clonedConfig, brain.items[ this.frameId ].config );
		
		brain.items[this.frameId].config = clonedConfig;
	};
		
	/*
		Processes the frame-attributes, gets the frame-specific deeplinks and sends an event to the stylefills-observer in order to tell that all possible scripts have been loaded.
		
			When the stylefills-observer is done, this will get a message, initialize the framework controller and hand over the frameId ( e.g. adler1 )
	*/
	this.start = function() {

		brain.debug.showInfo( 'Starting' );
		
		brain.language.set(brain.items[ this.frameId ].config.language, this.frameId);
		
		this.getFrameAttributes();	
		
		this.observers();
		
		var that = this;
		
		$(document).one( brain.events.stylefills.setupDone, function() {
					
			var framework = that.getFramework(that.frameId);
			
			framework.init();
		});
		
		var tEvent = $.Event( brain.events.stylefills.visualDone );
		$(document).triggerHandler( tEvent );
	};
	
	// data-attributes that have been put into the frame-tag are checked for relevance and update the frame-specific config
	this.getFrameAttributes = function() {
		
		var that = this;
		
		$.each( brain.items[ this.frameId ].config.frame, function(key, value) {
			
			if ( key.indexOf('data-') > -1 && key != 'data-package' ) {	// keys that are no data-attributes are left out, data-package does not apply
				
				if ( key === 'data-view') {
					
					var newParams	=	{};
					var tParamsArr	=	value.split('-');		// params split by '-'
					
					$.each( tParamsArr, function() {
						
						var paramPair = this.split(':');		// the value is split from the key by ':'
						
						newParams[ paramPair[0].toString() ] = paramPair[1].toString();
					});
					
					$.extend( brain.items[ that.frameId ].config.view, newParams );
				} else {
					
					var tOk			=	true;
					var tKeyArr		=	key.replace('data-', '').split('-');
					var tVar		=	brain.items[ that.frameId ].config;
					
					$.each( tKeyArr, function() {
						
						if ( tVar.hasOwnProperty( this ) ) {
							
							tVar		=	tVar[this];
						} else {
							
							tOk = false;
							return false;
						}
					});
					
					if (tOk) {
						
						var tValue	= that.getVal( value );
						var tObj	= brain.items[ that.frameId ].config;
						
						for( var i = 0; i < tKeyArr.length - 1; i++) {
							
							tObj	=	tObj[ tKeyArr[i] ];	
						}
						
						tObj[ tKeyArr[tKeyArr.length - 1] ] = tValue;
					}
				}
			}
		});
	};
	
	this.getVal = function(value) {
		
		if (value.indexOf(',') > -1) {		// value is an array
			
			var that		=	this;
			var valArr		=	value.split(',');
			var returnArr	=	[];
			
			$.each( valArr, function() {
				
				returnArr.push( that.getValType( this ) );
			});
			
			return returnArr;
		}
		
		return this.getValType(value);
	};
	
	this.getValType = function(value) {
		
		if ( !isNaN(value) ) {
			
			value = parseFloat( value );
			
			if ( value%1 === 0 ) {
				
				value = parseInt(value, 10);
			}
			
			return value;
			
		} else {
			
			if ( value === 'true' ) {
				
				return true;	
			} else if ( value === 'false' ) {
				
				return false;	
			} 
			
			return value;
		}
	};
		
	/*
		We have to pass the frameId to the framework controller	
	*/
	this.getFramework = function() {				
		
		brain.debug.showError( 'init.getFramework has to be extended' );
	};
});
brain.namespace.extend( 'language', {
	
	/*
		Returns the language String by the identifier
		We have to write the visual separated by a dot in front of the identifier, e.g. getText( 'sport.ranking' ) returns "Ranking" from the sport language file	
	*/
	getText: function(tIdentifier) {

		if (brain.data.language) {
		
			if (brain.data.language[ tIdentifier ] ) {
			
				return brain.data.language[ tIdentifier ];
			} else {
				
				return "This text does not exist";
			}					
		}
		
		return "There are no texts loaded";	
	},
	
	/*
		Replaces %% with one or more strings, passed in the tReplaceStringArr				
		
		Example:	"This is %% out of %%",
					tReplaceStringArr = ['one','two']
					
					returns "This is one out of two"
				
	*/
	getTextExt: function(tIdentifier, tReplaceStringArr) {
	
		var tNamespace		=	tIdentifier.split('.')[0];
		var tAttribute		=	tIdentifier.split('.')[1];
		
		if (brain.data.language[tNamespace]) {
		
			if (brain.data.language[tNamespace][tAttribute]) {
			
				var tText = brain.data.language[tNamespace][tAttribute];
				
				for (var i = 0; i < tReplaceStringArr.length; i++) {
					
					tText = tText.replace(/%%/, tReplaceStringArr[i]);
				}
			
				return tText;
			}

			return "This text does not exist.";
		}
		
		return "There are no texts loaded";	
	},
	
	/*
		Returns the month string of the language file by passing the date number	
	*/
	getMonthString: function(tMonth) {
	
		var tNamespace		=	tMonth.split('.')[0];
		var tAttribute		=	tMonth.split('.')[1];
		
		if (brain.data.language[tNamespace]) {
		
			if (brain.data.language[tNamespace].months) {
			
				return brain.data.language[tNamespace].months[tAttribute];
			}

			return "There are no months defined.";
		}
		
		return "There are no texts loaded";	
	},
	
	/*
		Returns the day string of the language file by passing the day number. 
		Possible return strings: monday, tuesday, ..
	*/
	getDayString: function(tDay) {
	
		var tNamespace		=	tDay.split('.')[0];
		var tAttribute		=	tDay.split('.')[1];
		
		if (brain.data.language[tNamespace]) {
		
			if (brain.data.language[tNamespace].days) {
			
				return brain.data.language[tNamespace].days[tAttribute];
			}

			return "There are no days defined.";
		}
		
		return "There are no texts loaded";	
	},
	
	
	/*
		Sets the language attribute into an element, converts ISO 639-2 to html5 compliant ISO 639-1
		
		@param tTag is the class-name of the element to add the attribute
		@param tCode is the ISO 639-2 language code that has to be converted and added
	*/

	set: function(tCode, frameId) {
	
		var tCode = this.getLanguage(tCode);
		
		$('#' + frameId).attr('lang', tCode);
	},
		
	getLanguage: function(tCode) {
		
		var tLanguage = '';
		
		switch( tCode ) {
			
			case "deu": 
				tCode = 'de';
				break;
			case "gsw":
				tCode = 'de';
				break;
			case "fra":
				tCode = 'fr';
				break;
			case "eng":
				tCode = 'en';
				break;
			case "ita":
				tCode = 'it';
				break;
			case "spa":
				tCode = 'es';
				break;
			default:
				tCode = 'de';
		}
			
		return tCode;
	}
});
brain.namespace.extend( 'loader.items', function() {
	
	$.extend( this, new brain.loader() );
	
	this.idPrefix	=	'loader:items';
	
	/*
		Different because we need different default options.
	*/
	this.getParams = function(options) {
		
		return brain.params.loader.items;
	};
});
brain.namespace.extend( 'loader', function() {
		
	this.idPrefix	=	'loader';
	this.id			=	false;
	this.progress	=	0;
	this.options	=	{};
	this.origURL	=	false;
	this.origCache	=	-1;
	
	this.parent = {
		
		/*
			We need to set the event options first, because of the this.
		*/
		getEventOptions: function() {		
			
			return {

				beforeSend:		$.proxy( this.sendStart,	this ),
				xhr:			$.proxy( this.sendProgress, this ),
				error:			$.proxy( this.error,	this ),
				complete:		$.proxy( this.complete, this ),
				success:		$.proxy( this.success, this ),
			};
		},
	
		/*
			At first call, this function defines a uniqe id, when called again, it returns the same id again and again.
		*/
		getId: function() {

			if (!this.id) {
				
				this.id = brain.utils.uniqId();
			}
			
			return this.idPrefix + this.id;

		},
		
		/*
			1.) Extends the this.options by the brain.params.loader.default options.
			2.) Extends the options by the event options, those has to be set by the loader because of the this.
			3.) Extends the options by passed options, to overwrite or set any of the options.
		*/
		setOptions: function(options) {
			
			$.extend( this.options, this.getParams() );
			$.extend( this.options, this.getEventOptions() );
			
			if (options) {
				
				for (var i in options) this.options[i] = options[i];
			}
		},			
					
		getTimestamp: function() {
				
			var time = new Date().getTime();
			
			if (brain.params.timestamp === 'hs') {
				
				time = parseInt( time / 100, 10 );
			} else if (brain.params.timestamp === 'sec') {
				
				time = parseInt( time / 1000, 10 );
			} else if (brain.params.timestamp === 'tensec') {
				
				time = parseInt( parseInt( time / 10000, 10 ).toString() + '0', 10 );
			}  else if (brain.params.timestamp === 'min') {
				
				time = parseInt( parseInt( time / 60000, 10 ).toString() + '0', 10 );
			}
			
			return time;
		},
		
		/*
			Can be extended if needed	
		*/
		getParams: function() {
			
			return brain.params.loader['default'];
		},
		
		/*
			Ajax call with options.
		*/
		load: function() {
			
			this.progress = 0;			
						
			if (this.origCache === -1) {
									
				this.origCache = this.options.cache;
			}
			
			if (this.origCache === false) {
				
				// we have to introduce our own logic of setting a timestamp
				
				if (!this.origURL) this.origURL = this.options.url + '';
				
				this.options.cache	=	true;
				
				var urlBinder		=	'?_=';
				
				if ( this.origURL.indexOf( '?' ) > -1 ) {
					
					urlBinder = '&_=';
				}
				
				this.options.url = this.origURL + urlBinder + this.getTimestamp();
			}
									
			$.ajax( this.options );
		},
		
		/*
			Before the ajax functions sends the request, this function is called, because of the progress bar.
		*/
		sendStart: function() {
							
			if (this.options.hasProgress) {
				
				var tEvent = $.Event( brain.events.loader.started + this.getId() );
				
				$(document).triggerHandler( tEvent );
			}
		},
		
		/*
			XHR triggered function for the progress bar, which sets the this.progress value.
		*/
		sendProgress: function() {

			if ( this.sendProgress ) {
			
				var that	=	this;
				var xhr		=	new window.XMLHttpRequest();
	
				xhr.addEventListener("progress", function(ev) {
				
					if (ev.lengthComputable) {
					
						that.progress = parseFloat( (ev.loaded / ev.total ) * 100 ).toFixed(2);	
					} else {
						
						if (that.progress < 60) {
						
							that.progress += 20;
						} else if (that.progress < 80) {
							
							that.progress += 4;
						} else {
							
							that.progress += 2;
						}
						
						if (that.progress >= 100) that.progress = 100;
					}

					var tEvent		=	$.Event( brain.events.loader.progress + that.getId() );
					tEvent.content	=	that.progress;

					$(document).triggerHandler( tEvent );
					
				}, false);
			
				return xhr;
			}
		},
		
		/*
			When the server responds without an error and in case there is a progress bar, this function triggers the brain.events.loader.progress event.
		*/
		complete: function() {
						
			if (this.options.hasProgress) {
				
				var tEvent = $.Event( brain.events.loader.ended + this.getId() );
				
				$(document).triggerHandler( tEvent );
			}
		},
		
		/*
			In case of respond errors, this function shows the error via brain.debug.showError and sends an error event. 
		*/
		error: function(data, textStatus, jqXHR, exception) {
						
			var tStatus	=	data.status;
			var parseError	=	jqXHR.message;
				
			if ( this.options.dataType == 'jsonp' && tStatus == 200 && parseError.indexOf('was not called') > -1 ) {
							
				var tData = this.extractJson( data.responseText );
			
				this.options.success(tData, tStatus, jqXHR);
			} else if ( this.options.dataType == 'jsonp' && tStatus == 200 ) {
				
				/*
					Do nothing	
				*/
			} else {
				
				var tError		=	'File could not be loaded: ' + tStatus + ', ' + parseError + ', ' + this.options.url;
				
				this.errorInfo();
				
				brain.debug.showError( tError );
				
				var tEvent		=	$.Event( brain.events.loader.error + this.getId() );
				tEvent.content	=	tError;
				tEvent.loaderId	=	this.getId();
								
				$(document).triggerHandler( tEvent );
				
				if (this.options.deferred) {
					
					this.options.deferred.resolve();
				}
								
				if ( this.sendProgress ) {
					
					this.complete();
				}
			}
		},
	
		/*
			Can be extended if needed	
		*/
		errorInfo: function() {
		
		},
		
		/*
			Resolves the deferred, in case no deferred is set in the options, this functions triggers the loader.done event.
		*/
		success: function(data, textStatus, jqXHR, exception) {
			
			if (this.options.deferred) {
				
				this.options.deferred.resolve();	
			} else {
						
				var tEvent = $.Event( brain.events.loader.done + this.getId() );
						
				$(document).triggerHandler( tEvent );
			}
		},
		
		/*
			Converts jsonp into json.
		*/
		extractJson: function(tText) {
						
			var startIndex	=	tText.indexOf( '{' );
			var stopIndex	=	tText.lastIndexOf( '}' ) + 1;
			var json		=	tText.substring( startIndex, stopIndex );			
			
			json = $.parseJSON(json);
			
			return json;
		}
	};
	
	this.getTimestamp		=	this.parent.getTimestamp;
	this.getParams			=	this.parent.getParams;
	this.getEventOptions	=	this.parent.getEventOptions;
	this.getId				=	this.parent.getId;
	this.setOptions			=	this.parent.setOptions;
	this.load				=	this.parent.load;
	this.sendStart			=	this.parent.sendStart;
	this.sendProgress		=	this.parent.sendProgress;
	this.complete			=	this.parent.complete;
	this.error				=	this.parent.error;
	this.errorInfo			=	this.parent.errorInfo;
	this.success			=	this.parent.success;
	this.extractJson		=	this.parent.extractJson;
});	
brain.namespace.extend( 'loader.language', function() {
	
	$.extend( this, new brain.loader() );
	
	this.idPrefix	=	'loader:language';
	this.defObj		=	false;
	this.namespace	=	false;
	/*
		Different because we need different default options.
	*/
	this.getParams = function(options) {
		
		return brain.params.loader.language;
	};
	
	/*
		Different because we need the deferred object and the namespace
	*/
	this.success = function(data, textStatus, jqXHR) {
		
		if (!brain.data.language)	brain.data.language = {};
		
		brain.data.language	=	 data;
		
		this.options.deferred.resolve();
	};
});
brain.namespace.extend( 'loader.scripts', function() {
	
	$.extend( this, new brain.loader() );
	
	this.idPrefix	=	'loader:scripts';
	
	/*
		Different because we need different default options.
	*/
	this.getParams = function(options) {
		
		return brain.params.loader[ 'scripts' ];
	};
	
	this.errorInfo = function() {
		
		console.info('↑↑↑>>> "' + this.options.url + '" is optional! Ignore the error or create an empty file. <<<↑↑↑' );
	};
});
brain.namespace.extend( 'loader.configs', function() {
	
	$.extend( this, new brain.loader() );
	
	this.idPrefix	=	'loader:configs';
	this.defObj		=	false;
	this.namespace	=	false;
	
	/*
		Different because we need different default options.
	*/
	this.getParams = function(options) {
		
		return brain.params.loader[ 'configs' ];
	};
	
	/*
		Different because we need the deferred object and the namespace
	*/
	this.success = function(data, textStatus, jqXHR) {

		$.extend(brain.visual[ this.namespace ].config, data);
		
		this.options.deferred.resolve();	
	};
	
	this.errorInfo = function() {
		
		console.info('↑↑↑>>> "' + this.options.url + '" is optional! Ignore the error or create the jsonp config. [instructions -> technical documentation] <<<↑↑↑' );
	};
});
brain.namespace.extend( 'loader.configs.frame', function() {
	
	$.extend( this, new brain.loader.configs() );
	
	this.idPrefix	=	'loader:configs:frame';
	this.defObj		=	false;
	this.namespace	=	false;
	this.frameId	=	false;
	
	/*
		Different because we need different default options.
	*/
	this.getParams = function(options) {
		
		return brain.params.loader[ 'configs' ];
	};
	
	/*
		Different because we need the deferred object and the namespace
	*/
	this.success = function(data, textStatus, jqXHR) {

		$.extend(brain.items[ this.frameId ].config, data);
		
		this.options.deferred.resolve();
	};
});
brain.namespace.extend( 'model', function(frameId) {
	
	this.idPrefix		=	'model';
	this.id				=	'model';
	this.frameId		=	frameId;						//	Has to be passed
	this.currentLevel	=	0;
	this.maxLevel		=	0;
	this.requiredData	=	{0:[]};							//	Contains the data that is defined at the beginning and definitly won't change
	this.activeData		=	{};								//	Variable, contains all the data, that is loaded in the model, can change during different levels
	this.loadedData		=	{};								//	Contains the received, loaded data
	this.timestamps		=	{};
	
	/*
		The init function has three jobs
			- Sets the first level of the activeData to the fist level of the requiredData	
			- Binds events to listen to the kill event
			- Kicks on the loading process
	*/
	this.init = function() {
		
		brain.debug.showInfo( '#' + this.frameId + ': Initializing model ' + this.id );
		
		this.activeData[0] = this.requiredData[0];			//	The required data-objects in level 0 can never be found through processing, they are fixed.
		this.bindEvents();
		this.getData();	
	};
	
	this.bindEvents = function() {
		
		$(document).on( this.frameId + brain.events.model.kill + this.id, $.proxy( this.kill, this ) );
		$(document).on( this.frameId + brain.events.model.updateModel + this.id, $.proxy( this.updateModel, this ) );
	};
	
	/*
		This function will be called when the model needs to be killed completely
			- Sets the current level to zero
			- Kills every data level
			- Kills the binding to the kill function
	*/
	this.kill = function() {
		
		this.currentLevel = 0;
		this.killUpperLevels(0);
														
		$(document).off( this.frameId + brain.events.model.kill + this.id, $.proxy( this.kill, this ) );
		$(document).off( this.frameId + brain.events.model.updateModel + this.id, $.proxy( this.updateModel, this ) );
	};
	
	/*
		- Kills all upper levels (above the first level because we don't want to decrease the "user" parameter below zero or affect another another model when initialized
		- Binds events and increases "user" parameter for currentLevel
		- Resets the loadedData for the currentLevel
		- Requests the data from the factory, depending on the currentLevel
	*/					
	this.getData = function() {
		
		var that = this;
		
		if ( this.currentLevel < this.maxLevel ) {
			
			this.killUpperLevels( this.currentLevel + 1 );
		}
		
		this.bindCurrentLevel();
		
		this.loadedData[this.currentLevel] = {};
		
		$.each( this.activeData[this.currentLevel], function() {
			
			var tDataObject = brain.data.factory.getInstance( brain.items[ that.frameId ].config.namespace, this[0], this[1] ); 
			
			tDataObject.get();
		});
	};
	
	/* 
		The controller can call this in order to update the model, e.g. when id's from data that has to be loaded have changed.
	*/
	this.updateModel = function(ev) {
		
		this.killUpperLevels( 0 );

		this.currentLevel		=	0;
		this.activeData			=	{};
		this.timestamps			=	{};

		this.activeData[0]		=	this.requiredData[0];
		this.checkData();
	};
	
	/*
		Kills all levels depending on the tLevel which is the first level to be killed	
	*/
	this.killUpperLevels = function(tLevel) {
		
		for( var i = tLevel; i <= this.maxLevel; i++ ) {
			
			this.killLevel(i);
		}
	};
	
	/*
		Kills one level which means:
			- Decreasing the "user" parameter from every data of this level by 1
			- Killing the update events of this level
			
	*/
	this.killLevel = function(tLevel) {
		
		if (this.activeData[tLevel] && this.activeData[tLevel].length > 0) {
			
			var that = this;
			
			$.each( this.activeData[tLevel], function() {
				
				var tDataId = this[0];
		
				if ( this[1] ) { 
					
					if (this[1] !== '') tDataId += this[1];
				}
			
				var tDataObject = brain.data.factory.getInstance( brain.items[ that.frameId ].config.namespace, this[0], this[1] ); 
				
				tDataObject.removeUser();
				
				$(document).off( brain.items[ that.frameId ].config.namespace + brain.events.data.update + tDataId, $.proxy( that.update, that ) );
			});
			
			this.activeData[tLevel] = [];
		}
	};
	
	/*
		Binds one level which means:
			- Increasing the "user" parameter from every data of this level by 1
			- Binding the update events of this level
	*/
	this.bindCurrentLevel = function() {
		
		var that = this;
		
		$.each( this.activeData[this.currentLevel], function() {
			
			var tDataId = this[0]; 
				
			if ((this[1] && this[1] !== '')) tDataId +=  this[1];
			
			var tDataObject = brain.data.factory.getInstance( brain.items[ that.frameId ].config.namespace, this[0], this[1] );
			
			tDataObject.addUser();
			
			$(document).on( brain.items[ that.frameId ].config.namespace + brain.events.data.update + tDataId, $.proxy( that.update, that ) );
		});
	};
	
	/*
		- The update function is called whenever one data has been received.
		- Finds out the data level of the date which is received (tCurrentLevel)
		- Fills the loadedData array with the received data
		- If the level of the received data is beyond the "global" this.currentLevel, we resets the this.currentLevel to the tCurrentLevel
		- Calls the checkData function which checks if we have another level to load or if we are finished with all levels
	*/
	this.update = function(ev) {
							
		var tUpdate = true;

		if ( ev.dataId in this.timestamps ) {

			if ( this.timestamps[ev.dataId] === ev.lastUpdate ) {
				
				tUpdate = false;
			} else {
				
				this.timestamps = {};
			}
		}

		if (tUpdate) {
			
			this.timestamps[ev.dataId]	=	ev.lastUpdate;
			var that					=	this;
			var tCurrentLevel			=	false;
			
			$.each( this.activeData, function(key, val) {
				
				$.each( val, function() {
					
					var tId = this[0];
					
					if ( this[1] ) tId += this[1];
					
					if (tId == ev.dataId ) {
						
						tCurrentLevel = parseInt(key,10);
					}
				});
			});
			
			/*
				LoadedData in the currentLevel has not to be deleted. (Only the data-object that kicked off the update will be replaced)
			*/
			if ( !this.loadedData[tCurrentLevel] ) this.loadedData[tCurrentLevel] = {};
			
			/*	
				We have to delete the next level. Otherwise, the check in checkData will result in a full loadedData in this level.
					Neventheless it is sufficient to delete the next level of loadedData. When this next level is loaded, the (afterwards) next level + 1 will be deleted.	
			*/
			if (this.loadedData[tCurrentLevel + 1]) this.loadedData[tCurrentLevel + 1] = {};
										
			this.loadedData[tCurrentLevel][ev.dataId] = ev.content; 
			
			if (tCurrentLevel < this.currentLevel) {
				
				this.timestamps = {};
				this.timestamps[ev.dataId]	=	ev.lastUpdate;
				this.killLevel(tCurrentLevel + 1);

				this.currentLevel = tCurrentLevel;
			}
			
			this.checkData(ev);
		}
	};

	/*
		Checks by comparing the loadedData with the activeData if we are finished with this level
			- When finished:		checks if we are done with all levels
				- When done:		sends the data to the controller
				- When not done:	
					- Increases the this.currentLevel by 1
					- Gets the next activeData level
					- Calls the getData function which restarts loading the level
	*/
	this.checkData = function(ev) {
		
		if ( brain.utils.getObjectSize(this.loadedData[this.currentLevel]) === this.activeData[this.currentLevel].length ) {
			
			if ( this.maxLevel == this.currentLevel ) {
			
				this.sendUpdate();								
			} else {
				
				this.currentLevel++;
				
				var hasNextLevel = this.getNextLevel();
				
				if (hasNextLevel) {
					
					this.getData();
				} else {
					
					this.sendUpdate();
				}
			}
		}
	};
	
	/*
		This function can be extended if needed
		
		e.g. when we got dependencies with more levels:
		
			switch(this.currentLevel) {
				
				case 0:
				
					break;
				case 1:
					
					break;
				...
					...
					...
				default:
				
					this.activeData[ this.currentLevel ] = this.requiredData[ this.currentLevel ];
					break;
			}	
			
		Important: If there is a case which does not need the next level, return false (@see checkData)
	*/
	this.getNextLevel = function() {
		
		// default
		this.activeData[ this.currentLevel ] = this.requiredData[ this.currentLevel ];
		
		return true;
	};
		
	/*
		Calls the processData function to finally process the data	
	*/
	this.sendUpdate = function() {	
		
		var that		=	this;
		var defObj		=	$.Deferred();	
		var tEvent		=	$.Event( this.frameId + brain.events.model.send + this.id );						
		tEvent.content	=	this.processData( this.mergeData(), defObj );
	
		defObj.then( function() {
									
			$(document).triggerHandler( tEvent );
		});
	};
	
	/*
		Merges the data from all levels to one data-object and returns it to the processData function	
	*/
	this.mergeData = function() {
		
		var tData = {};
		
		$.each( this.loadedData, function() {
			
			$.each( this, function( key, value ) {
				
				tData[key] = value;
			});
		});
								
		return JSON.parse( JSON.stringify(tData) );
	};
	
	/*
		This function can be extended if needed to process the data before sending it back to the model	
	*/
	this.processData = function(data, defObj) {
		
		defObj.resolve();			
		return data;
	};
});			
brain.namespace.extend( 'observer.clicks', function() {
	
	this.frameId = false;			// Has to be passed
	
	this.init = function() {
		
		brain.debug.showInfo( this.frameId + ': observer.clicks has not yet been extended. If you don\'t need it, you can ignore this.' );
	};
});
brain.namespace.extend( 'observer.live', function() {
	
	this.loader;
	this.data		=	false;
	this.frameId	=	false;			// Has to be passed
	
	this.init = function() {
		
		brain.debug.showInfo( this.frameId + ': Starting observer.live');
		
		this.loader	=	new brain.loader();
		
		this.loader.setOptions({
		
			url:		this.getUrl(),
			success:	$.proxy( this.sendUpdates, this )
		});
		
		this.update();
	};
	
	this.update = function() {					
		
		var that = this;
		
		this.loader.load();
		
		window.setTimeout( function() {
			
			that.update();
		}, brain.params.timers.live);
	};
	
	this.sendUpdates = function(tData) {
		
		if (!this.data) {
			
			this.data = tData;	
		} else if ( this.check(tData) ) {
			
			var tEvent		=	$.Event( brain.items[ this.frameId ].config.namespace + brain.events.updater.inform );
			tEvent.content	=	tData;
			
			$(document).triggerHandler( tEvent );
								
			if (this.loader.options.jsonpCallback) {

				eval( 'delete ' + this.loader.options.jsonpCallback.toString() );
			}
		}
	};
	
	this.check = function(data) {
					
		var tBool = false;
		
		$.each(this.data, function(key, value) {

			if (!data[key]) {
				
				tBool = true;
				return false;
			}
			
			if (data[key].lastUpdate != value.lastUpdate) {
				
				tBool = true;
				return false;
			}
		});

		return tBool;
	};
	
	this.getUrl = function() {
		
		brain.debug.showError( this.frameId + ': live.getUrl has not been extended');
	};
});
brain.namespace.extend( 'observer.navigation', function() {

	this.frameId = false;			// Has to be passed
		
	this.init = function() {
		
		brain.debug.showInfo('Starting observer.navigation');
		
		$(document).on( this.frameId + brain.events.framework.done, $.proxy( this.start, this ) );
	};
	
	this.start = function() {
		
		brain.debug.showError( 'navigation.start has not been extended');
	};
});
brain.namespace.extend( 'observer.site', function() {

	this.frameId = false;			// Has to be passed
	
	this.init = function() {					
		
		brain.debug.showInfo(this.frameId + 'Starting observer.site');
		
		this.bindEvents();					
		this.resize();
	};
	
	this.bindEvents = function() {
		
		$(window).on( 'resize', $.proxy( this.resize, this ) );
		$(window).on( 'resize', $.proxy( this.inform, this ) );
	};
	
	/*
		Informs every object that is interested about the site-resize, plus tells the stylefills-observer to run
	*/
	this.inform = function() {
		
		var tEvent = $.Event( this.frameId + brain.events.site.resized );
		
		$(document).triggerHandler( tEvent );
		
		tEvent = $.Event( brain.events.stylefills.checkStyles );
		
		$(document).triggerHandler( tEvent );
	};
	
	/*
		This function changes the brainCalculatedStyles-Tag	
	*/
	this.resize = function() {
		
		brain.debug.showInfo( this.frameId + ': observer.site.resize has not yet been extended. If you don\'t need it, you can ignore this.' );
	};
});
brain.namespace.extend( 'observer.stylefills', function() {
	
	this.items		=	0;
	this.sheets		=	[];
	this.properties	=	[ 'min-font-size', 'max-font-size' ];
	this.rules		=	[];
	this.running	=	false;
	
	this.init = function( items ) {
		
		brain.debug.showInfo( 'Starting global observer.stylefills');
		
		this.items = items;
		
		$(document).on( brain.events.stylefills.append, $.proxy( this.appendSheet, this ) );
		$(document).on( brain.events.stylefills.visualDone, $.proxy( this.countVisuals, this ) );
		$(document).on( brain.events.stylefills.checkStyles, $.proxy( this.runFills, this ) );
	};
	
	this.appendSheet = function(ev) {
		
		this.sheets.push( ev.content );
	};
	
	this.countVisuals = function(ev) {
	
		this.items--;
		
		if (this.items === 0) this.setup();
	};
	
	this.setup = function() {
		
		if (brain.params.hasStyleFills) {
		
			var that	=	this;
			var defArr	=	[];
			
			// The style-tag that will hold all the stylefill-rules
			$('head').append( '<style id="brainStyleFills"></style>' );
			
			// Load all sheets and parse them for stylefill-properties
			$.each( this.sheets, function() {
				
				var tUrl	=	this + '';
				var defObj	=	$.Deferred();
				
				defArr.push( defObj );
				
				$.ajax({
				
					url:		tUrl,
					cache:		true,
					dataType:	'text',
					success:	function( data, textStatus, jqXHR) {
						
						that.parse( data, defObj );	
						
						defObj.resolve();	
					},
					error:		function() {
						
						brain.debug.showError( 'Stylefills encountered an error loading ' + tUrl);
						
						defObj.resolve();
					}
				});
			});
			
			$.when.apply( this, defArr ).then( $.proxy( this.done, this ) );
		} else {
			
			brain.debug.showInfo('Stylefills are not used in this project !!!' );
			
			this.done();
		}
	};
	
	this.done = function() {
		
		brain.debug.showInfo( 'Stylefills: setup done' );
		
		var tEvent = $.Event( brain.events.stylefills.setupDone );
		
		$(document).triggerHandler( tEvent );	
	};
	
	this.parse = function( sheetText, defObj ) {
			
		for (var i in this.properties) {
			
			var property	=	this.properties[i];
			var selReg		=	new RegExp('([^}{]+){([^}]+)?' + property.replace('-', '\\-') + '[\\s\\t]*:[\\s\\t]*([^;]+)', 'gi');
			var support		=	this.getRule( property );
			var selMatch;
			
			while( selMatch == selReg.exec( sheetText ) ) {
				
				var selections	=	selMatch[1].replace(/^([\s\n\r\t]+|\/\*.*?\*\/)+/, '').replace(/[\s\n\r\t]+$/, '').split(',');
				var value = selMatch[3];	
				
				for (var j in selections) {
					
					var selection = selections[j];
					
					this.rules.push( {
						
						'selector':	selection,
						'support':	support[0],
						'rule':		support[1],
						'value':	value
					});
				}
			}
		}
		
		defObj.resolve();
	};
		
	this.getRule = function( property ) {
		
		var propertyFunction = property.replace(/(^|-)([a-z])/g, function (m1, m2, m3) { return m3.toUpperCase(); });
					
		if (	('Webkit' + propertyFunction) in document.body.style 
				|| ('Moz' + propertyFunction) in document.body.style 
				|| ('O' + propertyFunction) in document.body.style 
				|| property in document.body.style) 
		
				return [true, propertyFunction];
		
		else return [false, propertyFunction];
	};
	
	this.runFills = function() {
		
		if (!this.running) {
			
			this.running	=	true;
			var that		=	this;
			var styles		=	'';
			
			$('#brainStyleFills').empty();
			
			for (var i = 0; i < this.rules.length; i++) {
				
				var rule = this.rules[i];
				
				if (!rule.support) {
					
					styles += that.fills[rule.rule]( rule );
				}
			}	
					
			$('#brainStyleFills').html(styles);
			
			this.running = false;
		}
	};
	
	/*		Stylefill-functions		*/	
	this.fills = {
		
		MaxFontSize: function( rule ) {		
			
			var elements = $( rule.selector );
			
			if ( elements.length > 0) {
				
				var element		=	elements[0];
				var elFontSize	=	parseFloat( window.getComputedStyle( element, null).getPropertyValue('font-size') );
				
				if (elFontSize >= parseFloat( rule.value ) ) return rule.selector + '{font-size:' + rule.value + ';}';
			}
		},
		
		MinFontSize: function( rule ) {			
			
			var elements = $( rule.selector );
			
			if ( elements.length > 0) {
				
				var element		=	elements[0];
				var elFontSize	=	parseFloat( window.getComputedStyle( element, null).getPropertyValue('font-size') );
				
				if (elFontSize <= parseFloat( rule.value ) ) return rule.selector + '{font-size:' + rule.value + ';}';
			}
		}
	};
});
brain.namespace.extend( 'params', {
	
	development:	false,
	debug:			false,
	
	timestamp:	'sec',			//	default is sec for milliseconds, can be ms, hs, sec, tensec and min
	
	paths: {
		
		'brain': {
			
			language:	'languages',
			script:		'brainscripts',
			config:		'brainconfig',
			css:		'braincss',	
		},
		'dev': {
			
			language:	'devlanguages',
			css:		'devcss'
		}	
	},
	
	hasStyleFills:	false				// stylefills don't work in a cross-site-scripting environment, so they have to be avoided
});
brain.namespace.extend( 'params', {
	
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

brain.namespace.extend( 'progress', new function() {

	this.start = function(namespace, dataId) {
		
		if (!this[ namespace ]) { 
			
			this.newProgress(namespace);
		}
		
		if (typeof this[ namespace ].files[ dataId ] == 'undefined') {
			
			this[ namespace ].started++;
		}
		
		this[ namespace ].files[ dataId ] = 0;
		
		this.calculate(namespace, dataId, 0);
	};
	
	this.calculate = function(namespace, dataId, percent) {

		this[ namespace ].files[ dataId ] = parseInt(percent, 10);
		
		var sum = 0;
		
		$.each( this[ namespace ].files, function(key, value) {

			sum = ( sum + parseInt(value,10) );
		} );

		this[ namespace ].percent = sum / this[ namespace ].started;
		
		var tEvent		=	$.Event( namespace + brain.events.progress.update );
		tEvent.content	=	{
			
			overall:	parseInt( this[ namespace ].percent, 10 ),
			data:		this[ namespace ].files
		};

		$(document).triggerHandler( tEvent );
	};
	
	this.end = function(namespace, dataId) {
		
		if ($.inArray( dataId, this[ namespace ].arrived ) == -1) {
			
			this[ namespace ].ended++;
			this[ namespace ].arrived.push(dataId);	
		}
		
		this.calculate(namespace, dataId, 100);
		
		if ( this[ namespace ].started == this[ namespace ].ended ) {

			this.newProgress(namespace);
		}
	};
	
	this.newProgress = function(namespace) {
		
		this[ namespace ]			=	{};
		this[ namespace ].percent	=	0;
		this[ namespace ].files		=	{};
		this[ namespace ].started	=	0;
		this[ namespace ].ended		=	0;
		this[ namespace ].arrived	=	[];	
	};
} () );
$(document).ready( function() {
	
	new brain.setup.init().start();
});

brain.namespace.extend( 'setup.init', function() {
		
	/*
		At the start of every vein-based application, we need to find out how many brainFrames are declared and to check the device.
		This function initializes the loading process afterwards.
	*/
	this.items		=	[];
	this.visuals	=	[];
	
	this.start = function() {

		var that	=	this;
		var defArr	=	[ $.Deferred(), $.Deferred(), $.Deferred()];

		brain.setup.device.check(defArr[0]);
		this.check(defArr[1]);
		this.createVisuals(defArr[2]);		
				
		$.when.apply( this, defArr ).then( function() {
				
			new brain.observer.stylefills().init( that.items.length );
			
			that.load();	
		});
	};
	
	/*
		We need to get the id and the codebase of the brainFrame to push them it into the variable this.items.
		
		The variables
		
			this.items 
			this.visuals
		
		are set here.
	*/
	this.check = function(deferred) {

		var that = this;

		$('.brainFrame').each( function() {

			var item = {

				id:			( ( $(this).attr('id') ) ? $(this).attr('id') : false ),
				codebase:	( ( $(this).attr('data-package') ) ? $(this).attr('data-package') : false ),
				namespace:	( ( $(this).attr('data-package') ) ? $(this).attr('data-package').split('.')[0] : false ),
			};

			that.items.push( item );
			
			if ( $.inArray( item.codebase.split('.')[0], that.visuals ) == -1 ) {
				
				that.visuals.push( item.codebase.split('.')[0] );
			}
			
			$(this).addClass('brain' + brain.formatting.firstUpperCase(item.namespace) );
		});
		
		deferred.resolve();
	};
	
	/*
		We need to create the base namespace in case there are no visuals	
	*/
	this.createVisuals = function(deferred) {
		
		$.each(this.visuals, function() {
			
			if (!brain.visual[this])						brain.visual[this]						=	{};
			if (!brain.visual[this].config)				brain.visual[this].config					=	{};
			if (!brain.visual[this].config.frame)			brain.visual[this].config.frame			=	{};
			if (!brain.visual[this].config.frameSetting)	brain.visual[this].config.frameSetting	=	false;
		});
		
		deferred.resolve();	
	};
	
	/*
		First Step is to load:
		
			- brain css files
			- brain configs
			- brain packages
	*/
	this.load = function() {
		
		var defArr = [ $.Deferred(), $.Deferred(), $.Deferred() ];
		
		new brain.setup.configs().load(this.visuals, 'brain', defArr[0]);
		new brain.setup.css().append(this.visuals, 'brain', defArr[1]);

		if (brain.params.development) {
			
			defArr[2].resolve();
		} else {
					
			var tPackageSetup = new brain.setup[ 'scripts' ].packages();
			tPackageSetup.load( tPackageSetup.getPackages(this.items), 'brain', defArr[2]);	
		}
		
		$.when.apply( this, defArr ).then( $.proxy(this.loadLanguage, this) );
	};
	
	
	/*
		Third Step is to load the language, we need the brain config and client config to know which language should be loaded	
	*/
	this.loadLanguage = function() {
		
		var defObj = $.Deferred();
		
		new brain.setup.languages().load(this.visuals, defObj);
		
		$.when(defObj).then( $.proxy(this.init, this) );
	};
	
	/*
		Checks url params for visuals and initialization of the items	
	*/
	this.init = function() {
		
		var tItem	=	new brain.setup.items();

		tItem.data	=	this.items;
		tItem.init();	
	};
});
brain.namespace.extend( 'setup.params', function() {
	
	this.load = function(deferred) {
		
		var defObj	=	$.Deferred();
		var loader	=	this.getLoader();
		
		$.when(defObj).then( function() {
			
			deferred.resolve();
		});
			
		var changedOptions = {
		
			url:		this.getUrl(),
			deferred:	defObj
		};
		
		loader.setOptions( changedOptions );
		loader.load();
	};

	this.getLoader = function() {
		
		return new brain.loader['scripts']();	
	};

	this.getUrl = function() {
		
		var scriptArr	=	$('script');
		var scriptUrl	=	'';
		
		$.each( scriptArr, function() {	
			
			var veinFile = 'brain.vein.' + brain.params.version + '.min.js';
			
			if (brain.params.development) veinFile = 'brain.vein.' + brain.params.version + '.js';
		});
		
		return scriptUrl;
	};
});
brain.namespace.extend( 'setup.css', function() {
	
	this.append = function(visuals, type, deferred) {
		
		brain.debug.showInfo( 'Appending ' + type + 'css' );
		
		$.each( visuals, function(key, value) {
			
			var filePath = brain.params.paths[ type ].css;
				
			if (type === 'brain' && brain.params.development) filePath = brain.params.paths[ 'dev' ].css;			// switch to devcss directory for development
			
			var tPath	=	filePath + '/' + type + '.' + value + '.css';			
			var sheet	=	$( '<link rel="stylesheet" href="' + tPath + '" type="text/css" media="all" />' );
								
			$('head').append( sheet );
			
			/* Send the stylesheet-data to the stylefill-observer */
			var tEvent		=	$.Event( brain.events.stylefills.append );
			tEvent.content	=	tPath;
			
			$(document).triggerHandler( tEvent );
		});	
		
		deferred.resolve();	
	};
});
brain.namespace.extend( 'setup.device', {
		
	/*
		Checks if we use a touch device, checks if the device is a mobile device and sets the events.
		The params are set in the "global" attribute called brain.device which can be used everywhere inside of the namespace brain.
		Resolving the deferred afterwards to start the loading process of the packages.
	*/
	check: function(deferred, userAgent) {
		
		if (!userAgent) userAgent = navigator.userAgent;
		
		if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|Touch/i.test(userAgent) ) {
			
			brain.device.isClick			=	true;
			brain.device.startEvent		=	'touchstart';
			brain.device.holdEvent		=	'taphold';
			brain.device.moveEvent		=	'touchmove';
			brain.device.clickEvent		=	'touchend';
			brain.device.endEvent			=	'touchend';
			brain.device.scrollClickEvent	=	'touchmove touchend';	
			brain.device.hasTouch			=	true;	
			brain.device.isMobile			=	brain.setup.device.isMobile.any( userAgent );

			$(document).on(brain.device.scrollClickEvent, '.brainFrame', function(ev) {

				if (ev.type == 'touchmove') {
					
					brain.device.isClick = false;	
				} else if (ev.type == 'touchend') {
					
					brain.device.isClick = true;
				}
			});
		} else {
			
			brain.device.isClick			=	true;
			brain.device.startEvent		=	'mousedown';
			brain.device.holdEvent		=	'mousedown';
			brain.device.moveEvent		=	'mousemove';
			brain.device.clickEvent		=	'click';
			brain.device.endEvent			=	'mouseup';
			brain.device.scrollClickEvent	=	'click';
			brain.device.hasTouch			=	false;
			brain.device.isMobile			=	false;
		}
		
		deferred.resolve();
	},
	
	/*
		Mobile checking functions which returns true in case of a mobile device, otherwise it returns false.
	*/
	isMobile: {
		
		Android: function(userAgent) {
		
			if ( userAgent.match(/Android/i) && userAgent.match(/Mobile/i) ) return true;
		
			return false;
		},
		BlackBerry: function(userAgent) {
		
			if ( userAgent.match(/BlackBerry/i) ) return true;
			
			return false;
		},
		iOS: function(userAgent) {
		
			if ( userAgent.match(/iPhone|iPod/i) ) return true;
			
			return false;
		},
		Opera: function(userAgent) {
		
			if ( userAgent.match(/Opera Mini/i) ) return true;
			
			return false;
		},
		Windows: function(userAgent) {
		
			if ( userAgent.match(/IEMobile/i) || userAgent.match(/WPDesktop/i) ) return true;
			
			return false;
		},
		any: function(userAgent) {
			
			return ( this.Android(userAgent) || this.BlackBerry(userAgent) || this.iOS(userAgent) || this.Opera(userAgent) || this.Windows(userAgent) );
		}
	}
});
brain.namespace.extend( 'setup.items', function() {

	this.data = [];

	this.init = function() {

		var defArr			=	[ $.Deferred(), $.Deferred() ];
		
		this.setItemSpace( defArr[0] );
		this.updateCodeBase( defArr[1] );
		
		$.when.apply( this, defArr ).then( $.proxy(this.start, this) );
	};
	/*
		Depending on the id's of the brainFrames, this function creates the namespaces ( e.g. brain.items.adler1 ) which are nessecary for the configs of the items
	*/
	this.setItemSpace = function(deferred) {
		
		$.each( this.data, function() {
			
			brain.namespace.extend( 'items.' + this.id, {} );
		});
		
		deferred.resolve();
	};
	
	/*
		Passing trough the this.data array to redefine the codebases by attaching the string "brain.visual." before the codebase and reducing the codebase to the first element ( e.g. sport.tables.ranking leads to brain.visual.sport )
	*/
	this.updateCodeBase = function(deferred) {
		
		$.each( this.data, function() {
					
			this.codebase	=	'brain.visual.' + this.namespace;
		});
		
		deferred.resolve();
	};

	/*
		Checks the brainFrames for attributes and writes them to the related config ( e.g. brain.items.adler1.config ).
		We also need to hand over the frameId ( e.g. adler1 ) to the init of the codebases, because every vein-based application needs to have access to the related config. 
		Initializes the codebases of this.data ( e.g. brain.visual.sport.init, brain.visual.wahlen.init ).
	*/
	this.start = function() {

		$.each( this.data, function() {

			var tConfig			=	{};
			tConfig.frame		=	{};
			
			$.each($('#' + this['id']).get(0).attributes, function(key, attribute){
			
				tConfig.frame[attribute.name] = attribute.value;
			});
			
			tConfig.codebase	=	this.codebase;
			tConfig.namespace	=	this.namespace;
			
			brain.items[ this.id ].config = tConfig;

			var tPackage = brain;
			
			$.each( this.codebase.split('.'), function(key, value) {
				
				if (key != 0) {
					
					tPackage =  tPackage[ '' + this ];	
				}
			});
			
			if (!tPackage.init) {
				
				brain.debug.showError( 'Package ' + this.namespace + ' has no init() function defined' );				
			} else {

				var tInit = new tPackage.init();
				
				tInit.frameId	=	this['id'];
				tInit.namespace	=	this.namespace;
				tInit.configure();
			}
		});
	};
});

brain.namespace.extend( 'setup.languages', function() {
	
	this.load = function(visuals, deferred) {
		
		brain.debug.showInfo( 'Loading languages' );
		
		var defArr	=	[];
		
		$.each( visuals, function() {
			
			var namespace	=	this + '';
			var defObj		=	$.Deferred();
			var loader		=	new brain.loader.language();
				
			brain.visual[namespace].config.language = 'deu';	
			
			defArr.push( defObj );
			
			var tPath = brain.params.paths.brain.language;

			loader.setOptions({
			
				jsonpCallback:	'brainCallbackLang' + brain.formatting.firstUpperCase(namespace),
				url:			tPath + '/' + namespace + '.de.js',
				deferred:		defObj,
			});
			
			loader.namespace	=	namespace;
			
			loader.load();
		});
		
		$.when.apply( this, defArr ).then( function() {

			deferred.resolve();	
		});
	};
});
brain.namespace.extend( 'setup.scripts', function() {
	
	this.options	=	{};
	
	this.load = function(files, type, deferred) {
		
		var that		=	this;
		var defArr		=	[];
			
		$.each( files, function(key, value) {
			
			var loader			=	that.getLoader();
			var defObj			=	$.Deferred();
			
			var changedOptions	=	that.options;
			
			changedOptions['url']		=	that.getUrl(type, this);
			changedOptions['deferred']	=	defObj;
					
			defArr.push(defObj);
			
			loader.setOptions( changedOptions );
			loader.load();
		});
		
		$.when.apply( this, defArr ).then( function() {

			deferred.resolve();	
		});
	};

	this.getLoader = function() {
		
		return new brain.loader['scripts']();	
	};
		
	/*
		Has to be extended	
	*/

	this.getUrl = function(type, name) {};
});

brain.namespace.extend( 'setup.configs', function() {
	
	var data;
	
	this.options = {};
	
	this.getUrl = function(type, name) {
		
		return brain.params.paths[ type ].config + '/' + type + '.' + name + '.config.js';
	};
	
	this.getLoader = function() {
		
		return new brain.loader.configs();	
	};
	
	this.load = function(files, type, deferred) {

		var that		=	this;
		var defArr		=	[];
			
		$.each( files, function(key, value) {
			
			var loader			=	that.getLoader();
			var defObj			=	$.Deferred();
			
			var changedOptions	=	that.options;
			
			changedOptions['url']				=	that.getUrl(type, this);
			changedOptions['jsonpCallback']		=	'brainCallbackConfig' + brain.formatting.firstUpperCase(value) + brain.formatting.firstUpperCase(type);	
			changedOptions['deferred']			=	defObj;

			defArr.push(defObj);
			
			loader.namespace	=	value;
			loader.setOptions( changedOptions );
			
			loader.load();
		});
		
		$.when.apply( this, defArr ).then( function() {

			deferred.resolve();	
		});
	};
});
brain.namespace.extend( 'setup.scripts.packages', function() {
	
	$.extend( this, new brain.setup['scripts']() );
	
	this.getUrl = function(type, name) {
		
		return brain.params.paths[ type ].script + '/brain.' + name + '.js';
	};
	
	this.getPackages = function(items) {
		
		var fileArray	=	[];
		
		$.each( items, function() {
			
			fileArray.push( this.codebase );
		});
		
		fileArray = fileArray.sort( function(a, b) {
			
			return a.length - b.length;
		});

		return fileArray;
	};
});
brain.namespace.extend( 'utils', {
	
	uniqId: function (chars) {
		
		var tCount		=	parseInt( chars/4, 10) || 2;					
		var uid			=	'';					
		var getRandom	=	function() {

			return ( ( (1 + Math.random() ) * 0x10000 ) | 0 ).toString(16).substring(1);
		};

		for (var i = 0; i < tCount; i++) {

			uid += getRandom();
		}
	
		return uid;
	},
	
	/*
		Returns the number of elements in an object.
		
		@param obj is the JSON-Object we want to have the size of.
		@returns the size of the JSON-Object.
	*/
	getObjectSize: function(obj) {

		var size = 0;
		var key;

		for (key in obj) {

			if (obj.hasOwnProperty(key)) size++;
		}

		return size;
	}
});
brain.namespace.extend( 'view', function(frameId) {
	
	this.frameId = frameId;			// Has to be passed
	
	this.get = function(data) {
		
		brain.debug.showError( this.frameId + ': .get has to be extended in this view.' );
	};
});
