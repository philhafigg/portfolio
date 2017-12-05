brain.namespace.extend( 'visual.show.observer.site', function() {
	
	$.extend( this, new brain.observer.site() );
	
	this.widthBreakpoints	 = [
		
		'320-maxwidth',
		'420-maxwidth',
		'450-maxwidth',
		'520-maxwidth',
		'620-maxwidth',
		'640-maxwidth',
		'720-maxwidth',
		'750-maxwidth',
		'790-maxwidth',
		'940-maxwidth',
	];
	
	this.heightBreakpoints	 = [
		
		'330-maxheight',
		'420-maxheight',
		'500-maxheight',
		'620-maxheight',
	];
	
	this.bindEvents = function() {
		
		$(window).on( 'resize', $.proxy( this.resize, this ) );
		$(window).on( 'resize', $.proxy( this.inform, this ) );
		$('#' + this.frameId).on( 'touchmove', $.proxy( this.disableScroll, this) );
	};
	
	this.disableScroll = function(ev) {

		if ( $(ev.target).hasClass('brainFrame') || $(ev.target).hasClass('brain-live-menubutton')) {
			
			ev.preventDefault();
		}
	};
	
	this.checkHeaderStyleTag = function() {
		
		if (brain.visual[ this.namespace ].config.calculatedStyle) {
			
			var tHtml = '<style id="' + brain.visual[ this.namespace ].config.calculatedStyle + '_' + this.frameId + '"></style>';
				
			$('head').append( tHtml );
		}
	};
	
	this.calcHeight = function() {

		var config	= 	brain.items[ this.frameId ].config;
		var tCss	=	'';
		
		//content
		var tFrameWidth		=	$('#' + this.frameId + '.brainFrame').width();
		var tFrameHeight	=	$('#' + this.frameId + '.brainFrame').height();

		if (tFrameHeight < 30) tFrameHeight		=	$(document).height();
		if (tFrameWidth < 30) tFrameWidth		=	$(document).width();

		var slideshowImageHeight	=	$('#' + this.frameId + ' .brain-slideshow img').height();
		var slideshowTextHeight		=	$('#' + this.frameId + ' .brain-slideshow p').outerHeight() + $('#' + this.frameId + ' .brain-slideshow h3').outerHeight();
			
		tCss	+=	'#';
		
		$('#brainCalculatedStyles_' + this.frameId).html( tCss );
	};
	
	this.resize = function() {
		
		var that	=	this;
		var width	=	$('#' + this.frameId).outerWidth();
		
		$('#' + this.frameId).removeClass (function (index, css) {
			
			return (css.match (/\bbrain-max-width-\S+/g) || []).join(' ');
		});
		
		if (brain.device.isMobile) {
			
			$('.brainFrame').addClass('isMobile');
		} else {
			
			$('.brainFrame').addClass('isDesktop');
		}
		
		$.each( this.widthBreakpoints, function() {
			
			var size	=	parseInt(this.split('-')[0],10);
			var type	= 	this.split('-')[1];	

			if (type === 'maxwidth') {
				
				if (size >= width) {
					
					$('#' + that.frameId).addClass('brain-max-width-' + size);
				}	
			}
		});
		
		var height	=	$('#' + this.frameId).outerHeight();

		$('#' + this.frameId).removeClass (function (index, css) {
			
			return (css.match (/\bbrain-max-height-\S+/g) || []).join(' ');
		});

		$.each( this.heightBreakpoints, function() {
			
			var size	=	parseInt(this.split('-')[0],10);
			var type	= 	this.split('-')[1];	

			if (type === 'maxheight') {
				
				if (size >= height) {
					
					$('#' + that.frameId).addClass('brain-max-height-' + size);
				}	
			}
		});
		
		this.calcHeight();
	};
});