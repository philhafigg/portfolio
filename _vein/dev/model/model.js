apa.namespace.extend( 'model', function(frameId) {
	
	this.idPrefix		=	'model';
	this.id				=	'model';
	this.frameId		=	frameId;						//	Has to be passed
	this.currentLevel	=	0;
	this.maxLevel		=	0;
	this.requiredData	=	{0:[]};							//	Contains the data that is defined at the beginning and definitly won't change
	this.activeData		=	{};								//	Variable, contains all the data, that is loaded in the model, can change during different levels
	this.loadedData		=	{};								//	Contains the received, loaded data
	this.timestamps		=	{};
	
	/*
		The init function has three jobs
			- Sets the first level of the activeData to the fist level of the requiredData	
			- Binds events to listen to the kill event
			- Kicks on the loading process
	*/
	this.init = function() {
		
		apa.debug.showInfo( '#' + this.frameId + ': Initializing model ' + this.id );
		
		this.activeData[0] = this.requiredData[0];			//	The required data-objects in level 0 can never be found through processing, they are fixed.
		this.bindEvents();
		this.getData();	
	};
	
	this.bindEvents = function() {
		
		japa(document).on( this.frameId + apa.events.model.kill + this.id, japa.proxy( this.kill, this ) );
		japa(document).on( this.frameId + apa.events.model.updateModel + this.id, japa.proxy( this.updateModel, this ) );
	};
	
	/*
		This function will be called when the model needs to be killed completely
			- Sets the current level to zero
			- Kills every data level
			- Kills the binding to the kill function
	*/
	this.kill = function() {
		
		this.currentLevel = 0;
		this.killUpperLevels(0);
														
		japa(document).off( this.frameId + apa.events.model.kill + this.id, japa.proxy( this.kill, this ) );
		japa(document).off( this.frameId + apa.events.model.updateModel + this.id, japa.proxy( this.updateModel, this ) );
	};
	
	/*
		- Kills all upper levels (above the first level because we don't want to decrease the "user" parameter below zero or affect another another model when initialized
		- Binds events and increases "user" parameter for currentLevel
		- Resets the loadedData for the currentLevel
		- Requests the data from the factory, depending on the currentLevel
	*/					
	this.getData = function() {
		
		var that = this;
		
		if ( this.currentLevel < this.maxLevel ) {
			
			this.killUpperLevels( this.currentLevel + 1 );
		}
		
		this.bindCurrentLevel();
		
		this.loadedData[this.currentLevel] = {};
		
		japa.each( this.activeData[this.currentLevel], function() {
			
			var tDataObject = apa.data.factory.getInstance( apa.items[ that.frameId ].config.namespace, this[0], this[1] ); 
			
			tDataObject.get();
		});
	};
	
	/* 
		The controller can call this in order to update the model, e.g. when id's from data that has to be loaded have changed.
	*/
	this.updateModel = function(ev) {
		
		this.killUpperLevels( 0 );

		this.currentLevel		=	0;
		this.activeData			=	{};
		this.timestamps			=	{};

		this.activeData[0]		=	this.requiredData[0];
		this.checkData();
	};
	
	/*
		Kills all levels depending on the tLevel which is the first level to be killed	
	*/
	this.killUpperLevels = function(tLevel) {
		
		for( var i = tLevel; i <= this.maxLevel; i++ ) {
			
			this.killLevel(i);
		}
	};
	
	/*
		Kills one level which means:
			- Decreasing the "user" parameter from every data of this level by 1
			- Killing the update events of this level
			
	*/
	this.killLevel = function(tLevel) {
		
		if (this.activeData[tLevel] && this.activeData[tLevel].length > 0) {
			
			var that = this;
			
			japa.each( this.activeData[tLevel], function() {
				
				var tDataId = this[0];
		
				if ( this[1] ) { 
					
					if (this[1] !== '') tDataId += this[1];
				}
			
				var tDataObject = apa.data.factory.getInstance( apa.items[ that.frameId ].config.namespace, this[0], this[1] ); 
				
				tDataObject.removeUser();
				
				japa(document).off( apa.items[ that.frameId ].config.namespace + apa.events.data.update + tDataId, japa.proxy( that.update, that ) );
			});
			
			this.activeData[tLevel] = [];
		}
	};
	
	/*
		Binds one level which means:
			- Increasing the "user" parameter from every data of this level by 1
			- Binding the update events of this level
	*/
	this.bindCurrentLevel = function() {
		
		var that = this;
		
		japa.each( this.activeData[this.currentLevel], function() {
			
			var tDataId = this[0]; 
				
			if ((this[1] && this[1] !== '')) tDataId +=  this[1];
			
			var tDataObject = apa.data.factory.getInstance( apa.items[ that.frameId ].config.namespace, this[0], this[1] );
			
			tDataObject.addUser();
			
			japa(document).on( apa.items[ that.frameId ].config.namespace + apa.events.data.update + tDataId, japa.proxy( that.update, that ) );
		});
	};
	
	/*
		- The update function is called whenever one data has been received.
		- Finds out the data level of the date which is received (tCurrentLevel)
		- Fills the loadedData array with the received data
		- If the level of the received data is beyond the "global" this.currentLevel, we resets the this.currentLevel to the tCurrentLevel
		- Calls the checkData function which checks if we have another level to load or if we are finished with all levels
	*/
	this.update = function(ev) {
							
		var tUpdate = true;

		if ( ev.dataId in this.timestamps ) {

			if ( this.timestamps[ev.dataId] === ev.lastUpdate ) {
				
				tUpdate = false;
			} else {
				
				this.timestamps = {};
			}
		}

		if (tUpdate) {
			
			this.timestamps[ev.dataId]	=	ev.lastUpdate;
			var that					=	this;
			var tCurrentLevel			=	false;
			
			japa.each( this.activeData, function(key, val) {
				
				japa.each( val, function() {
					
					var tId = this[0];
					
					if ( this[1] ) tId += this[1];
					
					if (tId == ev.dataId ) {
						
						tCurrentLevel = parseInt(key,10);
					}
				});
			});
			
			/*
				LoadedData in the currentLevel has not to be deleted. (Only the data-object that kicked off the update will be replaced)
			*/
			if ( !this.loadedData[tCurrentLevel] ) this.loadedData[tCurrentLevel] = {};
			
			/*	
				We have to delete the next level. Otherwise, the check in checkData will result in a full loadedData in this level.
					Neventheless it is sufficient to delete the next level of loadedData. When this next level is loaded, the (afterwards) next level + 1 will be deleted.	
			*/
			if (this.loadedData[tCurrentLevel + 1]) this.loadedData[tCurrentLevel + 1] = {};
										
			this.loadedData[tCurrentLevel][ev.dataId] = ev.content; 
			
			if (tCurrentLevel < this.currentLevel) {
				
				this.timestamps = {};
				this.timestamps[ev.dataId]	=	ev.lastUpdate;
				this.killLevel(tCurrentLevel + 1);

				this.currentLevel = tCurrentLevel;
			}
			
			this.checkData(ev);
		}
	};

	/*
		Checks by comparing the loadedData with the activeData if we are finished with this level
			- When finished:		checks if we are done with all levels
				- When done:		sends the data to the controller
				- When not done:	
					- Increases the this.currentLevel by 1
					- Gets the next activeData level
					- Calls the getData function which restarts loading the level
	*/
	this.checkData = function(ev) {
		
		if ( apa.utils.getObjectSize(this.loadedData[this.currentLevel]) === this.activeData[this.currentLevel].length ) {
			
			if ( this.maxLevel == this.currentLevel ) {
			
				this.sendUpdate();								
			} else {
				
				this.currentLevel++;
				
				var hasNextLevel = this.getNextLevel();
				
				if (hasNextLevel) {
					
					this.getData();
				} else {
					
					this.sendUpdate();
				}
			}
		}
	};
	
	/*
		This function can be extended if needed
		
		e.g. when we got dependencies with more levels:
		
			switch(this.currentLevel) {
				
				case 0:
				
					break;
				case 1:
					
					break;
				...
					...
					...
				default:
				
					this.activeData[ this.currentLevel ] = this.requiredData[ this.currentLevel ];
					break;
			}	
			
		Important: If there is a case which does not need the next level, return false (@see checkData)
	*/
	this.getNextLevel = function() {
		
		// default
		this.activeData[ this.currentLevel ] = this.requiredData[ this.currentLevel ];
		
		return true;
	};
		
	/*
		Calls the processData function to finally process the data	
	*/
	this.sendUpdate = function() {	
		
		var that		=	this;
		var defObj		=	japa.Deferred();	
		var tEvent		=	japa.Event( this.frameId + apa.events.model.send + this.id );						
		tEvent.content	=	this.processData( this.mergeData(), defObj );
	
		defObj.then( function() {
									
			japa(document).triggerHandler( tEvent );
		});
	};
	
	/*
		Merges the data from all levels to one data-object and returns it to the processData function	
	*/
	this.mergeData = function() {
		
		var tData = {};
		
		japa.each( this.loadedData, function() {
			
			japa.each( this, function( key, value ) {
				
				tData[key] = value;
			});
		});
								
		return JSON.parse( JSON.stringify(tData) );
	};
	
	/*
		This function can be extended if needed to process the data before sending it back to the model	
	*/
	this.processData = function(data, defObj) {
		
		defObj.resolve();			
		return data;
	};
});			