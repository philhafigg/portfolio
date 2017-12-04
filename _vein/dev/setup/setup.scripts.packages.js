apa.namespace.extend( 'setup.scripts.packages', function() {
	
	japa.extend( this, new apa.setup['scripts']() );
	
	this.getUrl = function(type, name) {
		
		return apa.params.paths[ type ].script + '/apa.' + name + '.js';
	};
	
	/*
		Complex function to determine which packages has to be loaded and returns an array afterwards.
		
		In case:	wahlen.actual.ranking, wahlen.actual.results 
		It returns: [ wahlen.actual ]
		
		In case:	sport.ranking.tables, wahlen.actual.results 
		It returns: [ sport.ranking.tables, wahlen.actual.results ]
		
		In case:	sport.ranking.tables, wahlen.actual.results, wahlen.history
		It returns: [ sport.ranking.tables, wahlen ]
		
	*/
	this.getPackages = function(items) {
		
		var fileArray	=	[];
		
		japa.each( items, function() {
			
			fileArray.push( this.codebase );
		});
		
		fileArray = fileArray.sort( function(a, b) {
			
			return a.length - b.length;
		});
		
		var done		=	false;
		var filesToLoad	=	[];
		
		do {
			
			for (var i = 0; i < fileArray.length; i++) {
				
				var file	=	fileArray[i];
				var add		=	true;					
				
				for (var j = 0; j < filesToLoad.length; j++) {
					
					var existingFile =	filesToLoad[j];						
					
					if ( file.indexOf( existingFile ) > -1 ) {		// tFile is a subpackage of an existing file
						
						add = false;
					} else {										// tFile and existingFile have a common parent-package	
																		
						var fileArr		=	file.split('.');
						var existingArr	=	existingFile.split('.');
						var tMatch		=	true;
						var tFrom		=	-1;
						
						for (var k = fileArr.length-1; k >= 0; k--) {
							
							var fileSpace = fileArr[k];
							var existingSpace = existingArr[k];
							
							if (existingSpace !== undefined) {

								if (fileSpace == existingSpace) {
									
									tMatch = true;
									
									if (tFrom < k) tFrom = k;
								} else {
									
									tFrom	=	-1;
									tMatch	=	false;
								}
							}
						}
						
						if ( tMatch && tFrom >= 0 ) {
							
							add				=	false;
							filesToLoad[j]	=	fileArr.slice(0, tFrom + 1).join('.');
						}
					}
				}
				
				if (add) filesToLoad.push( file );
			}
			
			/*
				we have to check whether there were changes since the last run = the last loop has not affected changes
					if not, we can set done to true and exit
			*/	
			if ( japa(filesToLoad).not(fileArray).length === 0 && japa(fileArray).not(filesToLoad).length === 0 ) {
				
				done = true;
			} else {
				
				fileArray	=	filesToLoad;
				filesToLoad	=	[];
			}
			
		} while ( !done );

		return filesToLoad;
	};
});