brain.namespace.extend( 'visual.show.portfolio.detail.view', function(frameId) {

	$.extend( this, new brain.view() );

	this.get = function(content) {

		var	that	=	this;
		var config	=	brain.items[ this.frameId ].config;
		var tHtml	=	'';
		
		tHtml	+=	'<ul>';
		
		$.each(content, function(key, value) {

			tHtml	+=	'<li>';
			
			if (key%2 == 0) {
				
				
				tHtml	+=	'<section class="portfolio-left">';
				
				$.each(this.pictures, function(){
					
					tHtml	+=	'<img src="content/images/portfolio/' + this + '">';
				});
				
				if (this.pictures.length > 1) tHtml	+=	'<div class="portfolio-animated-bars"></div>';
				
				tHtml	+=	'</section>';
				tHtml	+=	'<section>';
				tHtml	+=	'<h1>' + this.header + '</h1>';
				
				if (this.company) {
					
					tHtml	+=	'<h2 class="company">' + this.company + '</h2>';
				}
				
				if (this.text) {
					
					tHtml	+=	'<p>' + this.text + '</p>';
				}
				
				if (this.sections) {
					
					tHtml	+=	'<p class="sections">' + this.sections + '</p>';
				}
				
				tHtml	+=	'</section>';

			} else {
				
				tHtml	+=	'<section>';
				tHtml	+=	'<h1>' + this.header + '</h1>';
				
				if (this.company) {
					
					tHtml	+=	'<h2 class="company">' + this.company + '</h2>';
				}
				
				if (this.text) {
					
					tHtml	+=	'<p>' + this.text + '</p>';
				}
				
				if (this.sections) {
					
					tHtml	+=	'<p class="sections">' + this.sections + '</p>';
				}
				
				if (this.link) {
					
					tHtml += '<ul>';
					
					$.each(this.link , function(key, value){
						
						tHtml	+=	'<li><a href="' + this.link + '">>Link ' + key + '<</a></li>';
					});
					
					tHtml += '<ul>';
					
				}
				
				tHtml	+=	'</section>';
				tHtml	+=	'<section class="portfolio-right">';
				
				$.each(this.pictures, function(){
					
					tHtml	+=	'<img src="content/images/portfolio/' + this + '">';
				});
				if (this.pictures.length > 1) tHtml	+=	'<div class="portfolio-animated-bars"></div>';
				
				tHtml	+=	'</section>';
			}
			
			tHtml	+=	'</li>';
		});

		
		tHtml	+=	'</ul>';
		
		return tHtml;
	};
});
