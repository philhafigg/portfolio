brain.namespace.extend( 'visual.show.nav.controller', function(frameId) {
	
	$.extend( this, new brain.controller(frameId) );
	
	this.id		=	'show:nav:controller';
	this.open	=	false;
	
	this.view = function(data) {

		return new brain.visual.show.nav.view(this.frameId);
	};
	
	this.bindEvents = function() {
		
		$.proxy( this.parent.bindEvents, this )();
		
		$(document).on( brain.device.clickEvent, '#' + this.frameId + ' #nav ul a', $.proxy( this.changePage, this ) );
		$(document).on( this.frameId + brain.visual.show.events.navigation.page.changed, $.proxy( this.updateHeader, this) );
		$(document).on( brain.device.clickEvent, '#' + this.frameId + ' #content', $.proxy( this.leaveNav, this ) );
		
		$(document).on( brain.device.clickEvent, '#' + this.frameId + ' #nav .social', $.proxy( this.openSocial, this ) );
	};
	
	this.render = function(ev) {
		
		$(this.container).addClass('hidden');
		
		this.initialized = true;
		
		if (ev) this.content = ev.content;
		
		var view		=	this.view();		
		view.frameId	=	this.frameId;

		$(this.container).html( view.get( this.content, this.counter ) );
		
		this.show();
	};
	
	this.show = function() {
		
		var that = this;
		
		setTimeout(function() {
			
			$(that.container).removeClass('hidden');
		}, 1000);
	};
	
	this.leaveNav 		=	function() {
		
		$('#' + this.frameId + ' #nav').removeClass('nav-open');
	};
	
	this.updateHeader	=	function() {

		var config				=	brain.items[ this.frameId ].config;
	};
	
	this.openSocial = function(ev) {
		
		if (ev.type != 'touchmove' && brain.device.isClick) {

			var social					=	$(ev.target).attr('class');
			
			switch(social) {
				
				case 'facebook':
					window.open("https://www.facebook.com/philipp.haf");
					break;
				case 'twitter':
					window.open("https://twitter.com/philipphaf");
					break;
				case 'artstation':
					window.open("https://www.artstation.com/artist/philipp_hafellner");
					break;
				case 'youtube':
					window.open("https://www.youtube.com/user/AnimationPhil");
					break;
			}
		}
	};
	
	this.openPage = function(ev) {
		
		var that	=	this;
		
		if (ev.type != 'touchmove' && brain.device.isClick) {
			
			if (that.open) {
				
				$('#' + this.frameId + ' #nav.top').removeClass('nav-open');

			} else {
				
				$('#' + this.frameId + ' #nav.top').addClass('nav-open');
			}
		}
	}
	
	this.changePage	= function(ev) {
		
		if (ev.type != 'touchmove' && brain.device.isClick) {

			if ($(ev.target).parent().hasClass('selected')) {
				
				if ($('#' + this.frameId + ' #nav.top').hasClass('nav-open') == false) {

					$('#' + this.frameId + ' #nav.top').addClass('nav-open');
				} else {
					
					$('#' + this.frameId + ' #nav.top').removeClass('nav-open');
				}
				
				
/*
			} else if ($('#' + this.frameId).hasClass('isMobile') && $('#' + this.frameId + ' #nav').hasClass('top')) {

*/
				
								
			} else {
				
				if (!$('#' + this.frameId + ' #nav').hasClass('top')) $('#' + this.frameId + ' #nav').addClass('top');
				
				$('#' + this.frameId + ' #nav.top').removeClass('nav-open');
				$('#' + this.frameId + ' #content').removeClass('hidden');

				var tId					=	$(ev.target).attr('data-page');
				var config				=	brain.items[ this.frameId ].config;
				config.view.page		=	tId;
				
				var tEvent = $.Event( this.frameId + brain.visual.show.events.navigation.page.changed );
					
				$(document).triggerHandler( tEvent );
					
				
			
			}
		}
	};
});