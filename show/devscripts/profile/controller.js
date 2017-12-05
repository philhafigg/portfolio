brain.namespace.extend( 'visual.show.profile.controller', function(frameId) {
	
	$.extend( this, new brain.controller(frameId) );
	
	this.id			=	'show:profile:controller';
	this.model		=	'profile:model';

	this.view = function(data) {

		return new brain.visual.show.profile.view(this.frameId);
	};
	
	this.render = function(ev) {
		
		$(this.container).addClass('hidden');
		
		this.initialized = true;
		
		if (ev) this.content = ev.content;
		
		var view		=	this.view();		
		view.frameId	=	this.frameId;

		$(this.container).html( view.get( this.content, this.counter ) );
		
		this.show();
	};
	
	this.show = function() {
		
		var that = this;
		
		setTimeout(function() {
			
			$(that.container).removeClass('hidden');
		}, 1000);
	};
});