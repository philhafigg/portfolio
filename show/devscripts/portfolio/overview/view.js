brain.namespace.extend( 'visual.show.portfolio.overview.view', function(frameId) {

	$.extend( this, new brain.view() );
	
	this.get = function(content) {

		var	that	=	this;
		var config	=	brain.items[ this.frameId ].config;
		var tHtml	=	'<nav>';
		tHtml		+=	'<ul>';

		tHtml		+=	'<li class="three">';
		tHtml		+=	'<a href="javascript:" data-page="three">';		
		tHtml		+=	'<h1>';
		tHtml		+=	brain.language.getText('three');
		tHtml		+=	'</h1>';
		tHtml		+=	'</a>';
		tHtml		+=	'</li>';
					
		tHtml		+=	'<li class="develop">';
		tHtml		+=	'<a href="javascript:" data-page="develop">';
		tHtml		+=	'<h1>';
		tHtml		+=	brain.language.getText('develop');
		tHtml		+=	'</h1>';
		tHtml		+=	'</a>';
		tHtml		+=	'</li>';
					
		tHtml		+=	'</ul>';
		tHtml		+=	'</nav>';
		
		tHtml		+=	'<section id="portfolio-content" class="portfolio-content">';
		tHtml		+=	'</section>';
		
		return tHtml;
	};
});
