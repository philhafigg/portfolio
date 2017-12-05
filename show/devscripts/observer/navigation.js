brain.namespace.extend( 'visual.show.observer.navigation', function() {
	
	$.extend( this, new brain.observer.navigation() );
	
	this.actualPageControllers = [];
	
	this.start	=	function() {
		
		this.bindEvents();
		
		var config	=	brain.items[ this.frameId ].config;
		
		if (config.hasheader) {
			
			new brain.visual.show.header.controller(this.frameId).init('#header');
		}
		
		if (config.hasnav) {
			
			new brain.visual.show.nav.controller(this.frameId).init( '#nav');
		}
		
		
		var tEvent = $.Event( this.frameId + brain.visual.show.events.navigation.page.changed );
				
		$(document).triggerHandler( tEvent );
	}
	
	this.bindEvents = function() {
		
		$(document).on( this.frameId + brain.visual.show.events.navigation.page.changed, $.proxy( this.changePage, this) );
		$(document).on( this.frameId + brain.visual.show.events.navigation.page.switched, $.proxy( this.switchPage, this) );
	};
	
	this.kill = function() {
		
		$(document).off( this.frameId + brain.visual.show.events.navigation.page.changed );
		$(document).off( this.frameId + brain.visual.show.events.navigation.page.switched );
				
	};
	
	this.switchPage = function(ev) {
		
		var config	=	brain.items[ this.frameId ].config;
		
		switch (config.view.subPage) {
			
			case 'develop':
				this.actualPageControllers.push( new brain.visual.show.portfolio[config.view.subPage].controller(this.frameId).init( '.portfolio-content') );
				break;
			case 'three':
				this.actualPageControllers.push( new brain.visual.show.portfolio[config.view.subPage].controller(this.frameId).init( '.portfolio-content') );
				break;
		}
	};
	
	this.changePage = function(ev) {

		this.killPage();
		
		this.buildPage();
	};
	
	this.killPage = function() {
		
		var that = this;

		$.each( this.actualPageControllers, function() {
			
			var tEvent = $.Event( that.frameId + brain.events.controller.kill + this );
			
			$(document).triggerHandler( tEvent );
		});

		this.actualPageControllers = [];
	};
	
	this.buildPage	=	function() {

		var config	=	brain.items[ this.frameId ].config;
		var tClass	=	$('#content').attr('class');
		
		if (tClass) $('#content').removeClass(tClass);
		
		$('#content').addClass(config.view.page);
		$('#content').html(this.getPlaceholder());
		
		$('#nav .' + tClass).removeClass('selected');
		$('#nav .' + config.view.page).addClass('selected');

		switch (config.view.page) {
			
			case 'portfolio':
				this.actualPageControllers.push( new brain.visual.show.portfolio.overview.controller(this.frameId).init( '#content') );
				break;
			case 'home':
				this.actualPageControllers.push( new brain.visual.show[config.view.page].controller(this.frameId).init( '#content') );
				break;
			case 'scripts':
				this.actualPageControllers.push( new brain.visual.show[config.view.page].controller(this.frameId).init( '#content') );
				break;
			case 'contact':
				this.actualPageControllers.push( new brain.visual.show[config.view.page].controller(this.frameId).init( '#content') );
				break;
			case 'profile':
				this.actualPageControllers.push( new brain.visual.show[config.view.page].controller(this.frameId).init( '#content') );
				break;
			case 'skills':
				this.actualPageControllers.push( new brain.visual.show[config.view.page].controller(this.frameId).init( '#content') );
				break;
		}
	};
	
	this.getPlaceholder = function() {
		
		var tHtml	=	'';
		tHtml		+=	'<div class="loadingScreen"><p>is loading</p></div>';
		
		return tHtml;
	};
});