brain.namespace.extend( 'visual.show.contact.controller', function(frameId) {
	
	$.extend( this, new brain.controller(frameId) );
	
	this.id		=	'show:contact:controller';
	
	this.init = function(container) {
		
		brain.debug.showInfo( '#' + this.frameId + ': Initializing ' + this.id );
			
		if (!container) container = '';
		
		this.container = '#' + this.frameId + ' ' + container;
		
		this.bindEvents();
		
		this.getData();
		
		emailjs.init("user_9uKbwXNYf29uHuTIeWF2x");
		
		return this.id;
	};
	
	this.view = function(data) {

		return new brain.visual.show.contact.view(this.frameId);
	};
	
	this.bindEvents = function() {
		
		$.proxy( this.parent.bindEvents, this )();
		
		$(document).on( brain.device.clickEvent, '#' + this.frameId + ' #content.contact .submitForm #sendMessage', $.proxy( this.sendMail, this ) );
		$(document).on( brain.device.clickEvent, '#' + this.frameId + ' #content.contact .submitForm #clearMessage', $.proxy( this.clearForm, this ) );
		
		
		$(document).on( brain.device.clickEvent, '#' + this.frameId + ' #content.contact .contact-infos .links', $.proxy( this.openSocial, this ) );
	};
	
	this.kill = function() {
		
		$.proxy( this.parent.kill, this )();
		
		$(document).off( brain.device.clickEvent, '#' + this.frameId + ' #content.contact .submitForm #sendMessage' );
		$(document).off( brain.device.clickEvent, '#' + this.frameId + ' #content.contact .submitForm #clearMessage' );
	};
	
	/*
		
		function adjust_textarea(h) {
    h.style.height = "20px";
    h.style.height = (h.scrollHeight)+"px";
}
	*/
	
	this.openSocial = function(ev) {
		
		if (ev.type != 'touchmove' && brain.device.isClick) {

			var social					=	$(ev.target).attr('class');
			
			
			switch(social) {
				
				case 'facebook':
					window.open("https://www.facebook.com/philipp.haf");
					break;
				case 'twitter':
					break;
				case 'artstation':
					window.open("https://www.artstation.com/artist/philipp_hafellner");
					break;
				case 'youtube':
					window.open("https://www.youtube.com/user/AnimationPhil");
					break;
			}
		}
	};
	
	this.sendMail = function(ev) {
		
		var input 	=  	$('#content.contact .contact-form .message').val();
		var mailAd 	=  	$('#content.contact .contact-form .mail').val();
		var name	=	$('#content.contact .contact-form .name').val();
		var config	=	brain.items[ this.frameId ].config;
/*
		if (input) {
			
			input = input.replace(/^[a-zA-Z0-9]+$/, ' ');
		}
*/
		if (config.allowMail) {
			
			emailjs.send("gmail", "emailtemplate", {"to_name":name,"reply_to":mailAd,"message_html":input});
		}
		
		$('#content.contact .message-notification').addClass('message-sent');
		
		window.setTimeout(function() {
			
			$('#content.contact .contact-form .message').val('');
			$('#content.contact .contact-form .mail').val('');
			$('#content.contact .contact-form .name').val('');
		}, 2000);
		
		
	};
	
	this.clearForm = function() {
		
		$('#content.contact .contact-form .message').val('');
		$('#content.contact .contact-form .mail').val('');
		$('#content.contact .contact-form .name').val('');
	};
});