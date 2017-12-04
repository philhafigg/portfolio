brain.namespace.extend( 'visual.show.home.view', function(frameId) {

	$.extend( this, new brain.view() );

	this.get = function(content) {

		var	that	=	this;
		var config	=	brain.items[ this.frameId ].config;
		var tHtml	=	'';
		tHtml		+=	'<section><canvas id="world"></canvas></section>';
		tHtml		+=	'<section>';
		tHtml		+=	'<p><a href="mailto:hafellner.philipp@gmail.com">hafellner.philipp@gmail.com</a></p>';	
		tHtml		+=	'</section>';
		
		return tHtml;
	};
});
