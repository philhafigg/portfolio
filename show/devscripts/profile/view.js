brain.namespace.extend( 'visual.show.profile.view', function(frameId) {

	$.extend( this, new brain.view() );

	this.get = function(content) {

		var	that	=	this;
		var config	=	brain.items[ this.frameId ].config;
		var tHtml	=	'';
		tHtml	+=	'<section class="front-items">';
		tHtml	+=	'<section>';
		tHtml	+=	'<img src="' + content.pic + '">';
		tHtml	+=	'</section>';
		tHtml	+=	'<section class="personal-items">';
		tHtml	+=	'<div class="over"><h1 class="under">' + content.name + ', ' + content.title + '</h1></div>';
		tHtml	+=	'<h2>' + content.description + '</h2>';
		tHtml	+=	'<h2>' + content.jobTitle + '</h2>';
		tHtml	+=	'</section>';
		tHtml	+=	'<section class="language-items">';
		tHtml	+=	'<div class="over"><h1>Languages</h1></div>';
		tHtml	+=	'<ul>';
		
		$.each(content.language, function() {
			
				tHtml	+=	'<li>';
				tHtml	+=	'<h2>' + this[0] + ' - ' + this[1] + '</h2>';
				tHtml	+=	'</li>';
		});
		
		tHtml	+=	'</ul>';
		tHtml	+=	'</section>';
		tHtml	+=	'</section>';
		
		tHtml	+=	'<section class="about-items">';
		tHtml	+=	'<div class="over"><h1>About Me</h1></div>';
		tHtml	+=	'<p>' + content.about + '</p>';
		tHtml	+=	'</section>';
		
		tHtml	+=	'<section class="education-items">';
		tHtml	+=	'<h1>Education</h1>';
		tHtml	+=	'<table>';
		
		$.each(content.education, function() {
			
				tHtml	+=	'<tr>';
				tHtml	+=	'<td>' + this.years[0] 
				
				if (this.years[1]) tHtml	+=	' - ' + this.years[1];
				
				tHtml	+=	'</td>';
				tHtml	+=	'<td>';
				tHtml	+=	'<ul>';
				tHtml	+=	'<li>';
				tHtml	+=	'<ul>';
				tHtml	+=	'<li>' + this.description[0] + '</li>';
				tHtml	+=	'<li>' + this.description[1] + '</li>';
				tHtml	+=	'</ul>';
				tHtml	+=	'</li>';
				
				if (this.exam) {
					
					tHtml	+=	'<li>';
					tHtml	+=	'<ul>';
					tHtml	+=	'<li>' + this.exam[0] + '</li>';
					tHtml	+=	'<li>' + this.exam[1] + '</li>';
					tHtml	+=	'</ul>';
					tHtml	+=	'</li>';
				}
				tHtml	+=	'</ul>';
				tHtml	+=	'</tr>';
		});
		
		tHtml	+=	'</table>';
		tHtml	+=	'</section>';
		
		tHtml	+=	'<section class="work-items">';
		tHtml	+=	'<h1>Work</h1>';
		tHtml	+=	'<table>';
		
		$.each(content.work, function() {
			
				tHtml	+=	'<tr>';
				tHtml	+=	'<td>' + this.years[0] 
				
				if (this.years[1]) tHtml	+=	' - ' + this.years[1];
				
				tHtml	+=	'</td>';
				tHtml	+=	'<td>';
				tHtml	+=	'<ul>';
				tHtml	+=	'<li>';
				tHtml	+=	'<ul>';
				tHtml	+=	'<li>' + this.description[0] + '</li>';
				tHtml	+=	'<li>' + this.description[1] + '</li>';
				tHtml	+=	'</ul>';
				tHtml	+=	'</li>';
				
				if (this.tasks) {
					
					$.each(this.tasks, function() {
					
						tHtml	+=	'<li>';
						tHtml	+=	this;
						tHtml	+=	'</li>';
					});
				}
				tHtml	+=	'</ul>';
				tHtml	+=	'</tr>';
		});
		
		tHtml	+=	'</table>';
		tHtml	+=	'</section>';
		
		return tHtml;
	};
});
