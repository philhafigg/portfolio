apa.namespace.extend( 'setup.device', {
		
	/*
		Checks if we use a touch device, checks if the device is a mobile device and sets the events.
		The params are set in the "global" attribute called apa.device which can be used everywhere inside of the namespace apa.
		Resolving the deferred afterwards to start the loading process of the packages.
	*/
	check: function(deferred, userAgent) {
		
		if (!userAgent) userAgent = navigator.userAgent;
		
		if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|Touch/i.test(userAgent) ) {
			
			apa.device.isClick			=	true;
			apa.device.startEvent		=	'touchstart';
			apa.device.holdEvent		=	'taphold';
			apa.device.moveEvent		=	'touchmove';
			apa.device.clickEvent		=	'touchend';
			apa.device.endEvent			=	'touchend';
			apa.device.scrollClickEvent	=	'touchmove touchend';	
			apa.device.hasTouch			=	true;	
			apa.device.isMobile			=	apa.setup.device.isMobile.any( userAgent );

			japa(document).on(apa.device.scrollClickEvent, '.apaFrame', function(ev) {

				if (ev.type == 'touchmove') {
					
					apa.device.isClick = false;	
				} else if (ev.type == 'touchend') {
					
					apa.device.isClick = true;
				}
			});
		} else {
			
			apa.device.isClick			=	true;
			apa.device.startEvent		=	'mousedown';
			apa.device.holdEvent		=	'mousedown';
			apa.device.moveEvent		=	'mousemove';
			apa.device.clickEvent		=	'click';
			apa.device.endEvent			=	'mouseup';
			apa.device.scrollClickEvent	=	'click';
			apa.device.hasTouch			=	false;
			apa.device.isMobile			=	false;
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