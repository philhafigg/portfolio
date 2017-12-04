apa.namespace.extend( 'controller', function(frameId) {
	
	this.frameId		=	frameId;				
	this.idPrefix		=	'controller';
	this.id				=	'';
	this.model			=	false;
	this.initialized	=	false;
	
	this.parent = {
		
		init: function(container) {
			
			apa.debug.showInfo( '#' + this.frameId + ': Initializing ' + this.id );
			
			if (!container) container = '';
			
			this.container = '#' + this.frameId + ' ' + container;
			
			this.bindEvents();
			
			this.getData();
			
			return this.id;
		},
		
		bindEvents: function() {
			
			if (this.model) {
				
				japa(document).on( this.frameId + apa.events.model.send + this.model, japa.proxy( this.checkView, this ) );
			}
			
			japa(document).on( this.frameId + apa.events.controller.kill + this.id, japa.proxy( this.kill, this ) );
		},
		
		kill: function() {
			
			apa.debug.showInfo('#' + this.frameId + ': Killing controller ' + this.id);
			
			japa(document).off( this.frameId + apa.events.model.send + this.model, japa.proxy( this.checkView, this ) );
			
			if (this.model) {
							
				var tEvent = japa.Event( this.frameId + apa.events.model.kill + this.model );
				
				japa(document).triggerHandler(tEvent);
				
				this.model = false;
			}
			
			japa(document).off( this.frameId + apa.events.controller.kill + this.id, japa.proxy( this.kill, this ) );
		},
		
		checkView: function(ev) {
			
			if (this.initialized) {
				
				this.update(ev);
			} else {
			
				apa.debug.showInfo('#' + this.frameId + ': Rendering view for ' + this.id);
				
				this.render(ev);
			}
		},
	
		render: function(ev) {
			
			this.initialized	=	true;
			var content			=	false;
			
			if (ev) content = ev.content;
			
			var view = this.view();
			
			view.frameId = this.frameId;
			
			japa(this.container).html( view.get( content ) );
			
			var tEvent = japa.Event( apa.events.stylefills.checkStyles );
		
			japa(document).triggerHandler( tEvent );
		},
		
		update: function(ev) {
			
			// default does nothing as we don't assume that this is a live-controller.
		},
	
		getData: function() {
			
			if (this.model != false) {
				
				var tModelArr = this.model.split(':');
				
				var tObj = apa.visual[ apa.items[ this.frameId ].config.namespace ];
				
				japa.each( tModelArr, function() {
					
					tObj = tObj['' + this];
				});
				
				var tModel = new tObj(this.frameId);
				
				tModel.init();
				
			} else {
				
				this.render();
			}
		}
	};
	
	this.init			=	this.parent.init;
	this.bindEvents		=	this.parent.bindEvents;
	this.kill			=	this.parent.kill;
	this.checkView		=	this.parent.checkView;
	this.render			=	this.parent.render;
	this.update			=	this.parent.update;
	this.getData		=	this.parent.getData;
	
	this.view = function(data) {
		
		apa.debug.showError( '.getView has to be extended in ' + this.id );
	};
});	