brain.namespace.extend( 'visual.show.framework.view', function(frameId) {

	$.extend( this, new brain.view() );
	
	this.get = function(content) {

		var config	=	brain.items[ this.frameId ].config;
		var tHtml	=	'';
		
		tHtml	+=	'<div class="bg">';
		
		tHtml	+=	'<div></div>';
		tHtml	+=	'<div></div>';
		tHtml	+=	'<div></div>';
		tHtml	+=	'<div></div>';
		tHtml	+=	'<div></div>';
		tHtml	+=	'<div></div>';
		tHtml	+=	'<div></div>';
		tHtml	+=	'<div></div>';
		tHtml	+=	'<div></div>';
		tHtml	+=	'<div></div>';
		tHtml	+=	'</div>';
		
		
		if (config.hasheader) {
			
			tHtml	+=	'<header id="header">';
			tHtml	+=	'</header>';
		}
		
		if (config.hasnav) {
			
			tHtml		+=	'<nav id="nav">';
			tHtml		+=	'</nav>	';
		}
		
		tHtml		+=	'<section id="content">';
		tHtml		+=	'</section>';
		tHtml		+=	'<footer>';
		tHtml		+=	'</footer>';
		
		return tHtml;
	};
});