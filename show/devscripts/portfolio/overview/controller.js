brain.namespace.extend( 'visual.show.portfolio.overview.controller', function(frameId) {
	
	$.extend( this, new brain.controller(frameId) );
	
	this.id		=	'show:portfolio:overview:controller';
	
	this.view = function(data) {

		return new brain.visual.show.portfolio.overview.view(this.frameId);
	};
	
	this.bindEvents = function() {
		
		$.proxy( this.parent.bindEvents, this )();
		
		$(document).on( brain.device.clickEvent, '#' + this.frameId + ' #content.portfolio ul li a', $.proxy( this.switchedPage, this ) );
	};
	
	this.kill = function() {
		
		$.proxy( this.parent.kill, this )();
		
		$(document).off( brain.device.clickEvent, '#' + this.frameId + ' #content.portfolio ul li a' );
	};
	
	this.switchedPage = function(ev) {

		if (ev.type != 'touchmove' && brain.device.isClick) {

			var tId					=	$(ev.currentTarget).attr('data-page');
			var config				=	brain.items[ this.frameId ].config;
			config.view.subPage		=	tId;

			var tEvent = $.Event( this.frameId + brain.visual.show.events.navigation.page.switched );
				
			$(document).triggerHandler( tEvent );
		}
	};
});