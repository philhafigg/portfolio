brain.namespace.extend( 'visual.show.scripts.view', function(frameId) {

	$.extend( this, new brain.view() );

	this.get = function(content) {

		var	that	=	this;
		var config	=	brain.items[ this.frameId ].config;
		var tHtml	=	'';
		
		if (!content.length) {
			
			tHtml	=	'<div class="noMessage"><span>' + brain.language.getText('noScripts') + '</span></div>'; 
		}
		
		return tHtml;
	};
});
