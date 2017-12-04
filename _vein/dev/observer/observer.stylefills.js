apa.namespace.extend( 'observer.stylefills', function() {
	
	this.items		=	0;
	this.sheets		=	[];
	this.properties	=	[ 'min-font-size', 'max-font-size' ];
	this.rules		=	[];
	this.running	=	false;
	
	this.init = function( items ) {
		
		apa.debug.showInfo( 'Starting global observer.stylefills');
		
		this.items = items;
		
		japa(document).on( apa.events.stylefills.append, japa.proxy( this.appendSheet, this ) );
		japa(document).on( apa.events.stylefills.visualDone, japa.proxy( this.countVisuals, this ) );
		japa(document).on( apa.events.stylefills.checkStyles, japa.proxy( this.runFills, this ) );
	};
	
	this.appendSheet = function(ev) {
		
		this.sheets.push( ev.content );
	};
	
	this.countVisuals = function(ev) {
		
		/*	Every visual sends a message, when it's client-specific stylesheets are loaded.
				When all are done we can start with the setup of the observer
		*/
		
		this.items--;
		
		if (this.items === 0) this.setup();
	};
	
	this.setup = function() {
		
		if (apa.params.hasStyleFills) {
		
			var that	=	this;
			var defArr	=	[];
			
			// The style-tag that will hold all the stylefill-rules
			japa('head').append( '<style id="apaStyleFills"></style>' );
			
			// Load all sheets and parse them for stylefill-properties
			japa.each( this.sheets, function() {
				
				var tUrl	=	this + '';
				var defObj	=	japa.Deferred();
				
				defArr.push( defObj );
				
				japa.ajax({
				
					url:		tUrl,
					cache:		true,
					dataType:	'text',
					success:	function( data, textStatus, jqXHR) {
						
						that.parse( data, defObj );	
						
						defObj.resolve();	
					},
					error:		function() {
						
						apa.debug.showError( 'Stylefills encountered an error loading ' + tUrl);
						
						defObj.resolve();
					}
				});
			});
			
			japa.when.apply( this, defArr ).then( japa.proxy( this.done, this ) );
		} else {
			
			apa.debug.showInfo('Stylefills are not used in this project !!!' );
			
			this.done();
		}
	};
	
	this.done = function() {
		
		apa.debug.showInfo( 'Stylefills: setup done' );
		
		var tEvent = japa.Event( apa.events.stylefills.setupDone );
		
		japa(document).triggerHandler( tEvent );	
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
			
			japa('#apaStyleFills').empty();
			
			for (var i = 0; i < this.rules.length; i++) {
				
				var rule = this.rules[i];
				
				if (!rule.support) {
					
					styles += that.fills[rule.rule]( rule );
				}
			}	
					
			japa('#apaStyleFills').html(styles);
			
			this.running = false;
		}
	};
	
	/*		Stylefill-functions		*/	
	this.fills = {
		
		MaxFontSize: function( rule ) {		
			
			var elements = japa( rule.selector );
			
			if ( elements.length > 0) {
				
				var element		=	elements[0];
				var elFontSize	=	parseFloat( window.getComputedStyle( element, null).getPropertyValue('font-size') );
				
				if (elFontSize >= parseFloat( rule.value ) ) return rule.selector + '{font-size:' + rule.value + ';}';
			}
		},
		
		MinFontSize: function( rule ) {			
			
			var elements = japa( rule.selector );
			
			if ( elements.length > 0) {
				
				var element		=	elements[0];
				var elFontSize	=	parseFloat( window.getComputedStyle( element, null).getPropertyValue('font-size') );
				
				if (elFontSize <= parseFloat( rule.value ) ) return rule.selector + '{font-size:' + rule.value + ';}';
			}
		}
	};
});