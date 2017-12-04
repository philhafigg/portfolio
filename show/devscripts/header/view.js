brain.namespace.extend( 'visual.show.header.view', function(frameId) {

	$.extend( this, new brain.view() );

	this.get = function() {

		var	that	=	this;
		var config	=	brain.items[ this.frameId ].config;
		var tHtml	=	'';

		tHtml	+=	'<h1>';
		tHtml	+=	brain.language.getText('philipp');
		tHtml	+=	'</h1>';

		return tHtml;
	};
});
