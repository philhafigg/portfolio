brain.namespace.extend( 'visual.show.contact.view', function(frameId) {

	$.extend( this, new brain.view() );
	
	this.get = function(content) {

		var	that	=	this;
		var config	=	brain.items[ this.frameId ].config;
		var tHtml	=	'';
		tHtml		+=	'<section class="contact-form">';
		tHtml		+=	'<h1>Contact Form</h1>';
		tHtml		+=	'<div class="form-style-8">';
		
		tHtml		+=	'<form>';
		tHtml		+=	'<input class="name" type="text" name="field1" placeholder="Full Name" />';
		tHtml		+=	'<input class="mail" type="email" name="field2" placeholder="Email" />';
		tHtml		+=	'<textarea class="message" placeholder="Message"></textarea>';
		tHtml		+=	'<span class="message-notification">Sent</span>';
		tHtml		+=	'</form>';
		tHtml		+=	'</div>';
		tHtml		+=	'<ul class="submitForm">';
		tHtml		+=	'<li><a href="javascript:" id="sendMessage">Send</a></li>';
		tHtml		+=	'<li><a href="javascript:" id="clearMessage">Clear</a></li>';
		tHtml		+=	'</ul>';
		tHtml		+=	'</section>';
		
		tHtml		+=	'<section class="contact-infos">';
		tHtml		+=	'<h1>Find Me</h1>';
		tHtml		+=	'<ul class="links">';
		tHtml		+=	'<li><a href="javascript:" class="facebook"></a></li>';
 		tHtml		+=	'<li><a href="javascript:" class="twitter"></a></li>';
		tHtml		+=	'<li><a href="javascript:" class="artstation"></a></li>';
		tHtml		+=	'<li><a href="javascript:" class="youtube"></a></li>';
		tHtml		+=	'</ul>';
		
		tHtml		+=	'<table>';
		tHtml		+=	'<tr>';
		tHtml		+=	'<td>Address</td>';
		tHtml		+=	'<td>1020 Vienna Austria</td>';
		tHtml		+=	'</tr>';
		tHtml		+=	'<tr>';
		tHtml		+=	'<td>Telephone</td>';
		tHtml		+=	'<td>+43 664 416 989 1</td>';
		tHtml		+=	'</tr>';
		tHtml		+=	'<tr>';
		tHtml		+=	'<td>E-Mail</td>';
		tHtml		+=	'<td>hafellner.philipp&#64;gmail.com</td>';
		tHtml		+=	'</tr>';
		tHtml		+=	'</table>';
		
		tHtml		+=	'</section>';
		
		
		return tHtml;
	};
});
