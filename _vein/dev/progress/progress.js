apa.namespace.extend( 'progress', new function() {

	this.start = function(namespace, dataId) {
		
		if (!this[ namespace ]) { 
			
			this.newProgress(namespace);
		}
		
		if (typeof this[ namespace ].files[ dataId ] == 'undefined') {
			
			this[ namespace ].started++;
		}
		
		this[ namespace ].files[ dataId ] = 0;
		
		this.calculate(namespace, dataId, 0);
	};
	
	this.calculate = function(namespace, dataId, percent) {

		this[ namespace ].files[ dataId ] = parseInt(percent, 10);
		
		var sum = 0;
		
		japa.each( this[ namespace ].files, function(key, value) {

			sum = ( sum + parseInt(value,10) );
		} );

		this[ namespace ].percent = sum / this[ namespace ].started;
		
		var tEvent		=	japa.Event( namespace + apa.events.progress.update );
		tEvent.content	=	{
			
			overall:	parseInt( this[ namespace ].percent, 10 ),
			data:		this[ namespace ].files
		};

		japa(document).triggerHandler( tEvent );
	};
	
	this.end = function(namespace, dataId) {
		
		if (japa.inArray( dataId, this[ namespace ].arrived ) == -1) {
			
			this[ namespace ].ended++;
			this[ namespace ].arrived.push(dataId);	
		}
		
		this.calculate(namespace, dataId, 100);
		
		if ( this[ namespace ].started == this[ namespace ].ended ) {

			this.newProgress(namespace);
		}
	};
	
	this.newProgress = function(namespace) {
		
		this[ namespace ]			=	{};
		this[ namespace ].percent	=	0;
		this[ namespace ].files		=	{};
		this[ namespace ].started	=	0;
		this[ namespace ].ended		=	0;
		this[ namespace ].arrived	=	[];	
	};
} () );