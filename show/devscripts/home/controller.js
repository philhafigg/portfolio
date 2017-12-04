brain.namespace.extend( 'visual.show.home.controller', function(frameId) {
	
	$.extend( this, new brain.controller(frameId) );
	
	this.id			=	'show:home:controller';
	this.model		=	'homeItems:model';
	this.counter	=	0;
	this.direction	=	0.01;
	
	this.view = function(data) {

		return new brain.visual.show.home.view(this.frameId);
	};
	
	this.render = function(ev) {
		
		$(this.container).addClass('hidden');
		
		if (!brain.data.animation) {
			
			brain.data.animation = Math.floor(Math.random() * 2) + 1
		}
		
		this.initialized = true;
		
		if (ev) this.content = ev.content;
		
		var view		=	this.view();		
		view.frameId	=	this.frameId;

		$(this.container).html( view.get( this.content, this.counter ) );
		
		this.renderThree();
		
		this.show();
	};
	
	this.renderThree = function() {
		
		var that	=	this;
		
		
		if (BABYLON.Engine.isSupported()) {
			
            var canvas = document.getElementById("world");
            var engine = new BABYLON.Engine(canvas, true);
            //no loading screen
            BABYLON.SceneLoader.ShowLoadingScreen = false;
            
            //GLOBAL VARIABLE
			scene = new BABYLON.Scene(engine);
			window.addEventListener("resize", function () { engine.resize(); });
			var cam = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 25, new BABYLON.Vector3(0,3,0), scene);
			
            BABYLON.SceneLoader.Load("", "out.babylon", engine, 
            	
            	function (scene) {
	            	
	            	scene.internalMesh = scene.getMeshByName("out_Mesh");
	            	
	            	var EmptyPivot = new BABYLON.Mesh("pivos", scene);scene.internalMesh.parent = EmptyPivot;EmptyPivot.position.y = 5.0;
	            	//var matrix = new BABYLON.Matrix.TranslationToRef(0, 5, 0, scene.internalMesh.getPivotMatrix());scene.internalMesh.setPivotMatrix(matrix);
	            	
	            	
	            	
				//scene.registerBeforeRender(function() {   });

				   scene.clearColor = new BABYLON.Color4(0,0,0,0);
				   // scene.clearColor = new BABYLON.Color4(0,0,0,1);
				   scene.executeWhenReady(function () {
				   scene.activeCamera = cam;
							   
					  //  var shadowGenerator0 = new BABYLON.ShadowGenerator(2000, scene.lights[0]);
				        
				        
						//scaling
						engine.setHardwareScalingLevel(720.0 / window.innerHeight);

	                    engine.runRenderLoop(function() {
	                        
							scene.render();
							EmptyPivot.rotation.x += that.direction;
	                    });	
                });
            }, function (progress) {
	            //loading screen

				
            });
		}
	};
	
	this.bindEvents = function() {
		
		$.proxy( this.parent.bindEvents, this )();

		$(document).on( brain.device.clickEvent, '#' + this.frameId + ' #content.home a', $.proxy( this.changePage, this ) );
		
		$(document).on( "mousemove", '#' + this.frameId, $.proxy( this.checkMouse, this ) );
		
	};
	
	this.checkMouse = function(ev) {
		
		var width = $('#' + this.frameId).width()/2;
		var that = this;

		if (ev.pageX < width) {

			that.direction = -0.01;
		} else {
			
			that.direction = 0.01;
		}
	};
	
	this.changePage	= function(ev) {

		if (ev.type != 'touchmove' && brain.device.isClick) {

			var tId					=	$(ev.currentTarget).attr('data-page');
			var config				=	brain.items[ this.frameId ].config;
			config.view.page		=	tId;

			var tEvent = $.Event( this.frameId + brain.visual.show.events.navigation.page.changed );
				
			$(document).triggerHandler( tEvent );
				
			$('#' + this.frameId + ' #nav').addClass('top');
		}
	};
	
	this.show = function() {
		
		var that = this;
		
		setTimeout(function() {
			
			$(that.container).removeClass('hidden');
		}, 1500);
	};
});