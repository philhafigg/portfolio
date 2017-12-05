brain.namespace.extend( 'visual.show.portfolio.abstract.controller', function(frameId) {
	
	$.extend( this, new brain.controller(frameId) );
	
	this.render = function(ev) {
		
		this.initialized = true;
		
		if (ev) this.content = ev.content;
		
		var view		=	this.view();		
		view.frameId	=	this.frameId;

		$(this.container).html( view.get( this.content) );
		
		var pageElement = document.getElementById("portfolio-content");
		var that = this;
			
		that.scrollDown();
	};

	
	this.scrollDown = function() {

		$('#portfolio-content').scrollView();
/*
	    while(pageElement != null){        
	        positionX += pageElement.offsetLeft;        
	        positionY += pageElement.offsetTop;        
	        pageElement = pageElement.offsetParent;        
	        window.scrollTo(positionX, positionY);    
	    }
*/
	};  


});