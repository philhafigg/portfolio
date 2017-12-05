brain.namespace.extend( 'visual.show.nav.view', function(frameId) {

	$.extend( this, new brain.view() );

	this.get = function() {

		var	that	=	this;
		var config	=	brain.items[ this.frameId ].config;
		var tHtml	=	'';
		
		tHtml 		+=	'<div class="social"><a href="javascript:" class="twitter"></a></div>';
		
		tHtml	+=	'<ul>';

		$.each(config.modules, function() {

			tHtml	+=	'<li class="' + this + '"><a href="javascript:" data-page="' + this + '">';
			
/*
			tHtml	+=	'<svg width="200" height="50" data-page="' + this + '">';
			tHtml	+=	'<line class="top-left" 	x1="-50" 	y1="0" 		x2="50" 	y2="0" />';
			tHtml	+=	'<line class="top-right" 	x1="50" 	y1="0" 		x2="100"	y2="0" />';
			tHtml	+=	'<line class="left-top" 	x1="0" 		y1="-25"	x2="0" 		y2="25" />';
			tHtml	+=	'<line class="left-bottom" 	x1="0" 		y1="25" 	x2="0" 		y2="75" />';
			tHtml	+=	'<line class="bottom-left" 	x1="-50"	y1="50" 	x2="50" 	y2="50" />';
			tHtml	+=	'<line class="bottom-right" x1="50" 	y1="50" 	x2="100" 	y2="50" />';
			tHtml	+=	'<line class="right-top" 	x1="100" 	y1="-25"	x2="100" 	y2="25" />';
			tHtml	+=	'<line class="right-bottom" x1="100" 	y1="25" 	x2="100" 	y2="75" />';
			tHtml	+=	'</svg>';
*/
			tHtml	+=	this;
			tHtml	+=	'</a>';
			tHtml	+=	'</li>';
		});
		
		tHtml	+=	'</ul>';
		tHtml	+=	'<div class="burgerButton">';
		tHtml	+=	'<span></span>';
		tHtml	+=	'<span></span>';
		tHtml	+=	'<span></span>';
		tHtml	+=	'</div>';
		
		return tHtml;
	};
});
