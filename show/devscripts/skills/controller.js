brain.namespace.extend( 'visual.show.skills.controller', function(frameId) {
	
	$.extend( this, new brain.controller(frameId) );
	
	this.id			=	'show:skills:controller';
	this.model		=	'skills:model';

	this.view = function(data) {

		return new brain.visual.show.skills.view(this.frameId);
	};
	
	this.render = function(ev) {
			
		this.initialized	=	true;
		var content			=	false;
		
		if (ev) content = ev.content;
		
		var view = this.view();
		
		view.frameId = this.frameId;
		
		$(this.container).html( view.get(content) );
		
		view.createSVG(content)
	};
	
	this.bindEvents = function() {

		$.proxy( this.parent.bindEvents, this )();
		
		$(document).on( brain.device.clickEvent, '#' + this.frameId + ' #content.skills svg .nodes circle', $.proxy( this.showDetails, this ) );
	};
	
	this.kill = function() {
		
		$.proxy( this.parent.kill, this )();
		
		$(document).off( brain.device.clickEvent, '#' + this.frameId + ' #content.skills svg .nodes circle', $.proxy( this.showDetails, this ) );
	};
	
	this.showDetails = function(ev) {

		if (ev.type != 'touchmove' && brain.device.isClick) {

			var tId		=	$(ev.target).attr('id');

		//	var tHtml	= '<span>' + brain.language.getText('detail_' + tId) + '<span>';
			var tHtml	= brain.language.getText('detail_' + tId);
			
			$('#content.skills .info-box').html(tHtml);
			$('#content.skills .info-box').addClass('info-box-show');
			
			window.setTimeout(function() {
				
				$('#content.skills .info-box').removeClass('info-box-show');
			}, 5000);
		}
	};
});