apa.namespace.extend( 'language', {
	
	/*
		Returns the language String by the identifier
		We have to write the visual separated by a dot in front of the identifier, e.g. getText( 'sport.ranking' ) returns "Ranking" from the sport language file	
	*/
	getText: function(tIdentifier) {
	
		var tNamespace		=	tIdentifier.split('.')[0];
		var tAttribute		=	tIdentifier.split('.')[1];
		
		if (apa.data.language[ tNamespace ]) {
		
			if (apa.data.language[ tNamespace ][ tAttribute ] ) {
			
				return apa.data.language[ tNamespace ][ tAttribute ];
			} else {
				
				return "This text does not exist";
			}					
		}
		
		return "There are no texts loaded";	
	},
	
	/*
		Replaces %% with one or more strings, passed in the tReplaceStringArr				
		
		Example:	"This is %% out of %%",
					tReplaceStringArr = ['one','two']
					
					returns "This is one out of two"
				
	*/
	getTextExt: function(tIdentifier, tReplaceStringArr) {
	
		var tNamespace		=	tIdentifier.split('.')[0];
		var tAttribute		=	tIdentifier.split('.')[1];
		
		if (apa.data.language[tNamespace]) {
		
			if (apa.data.language[tNamespace][tAttribute]) {
			
				var tText = apa.data.language[tNamespace][tAttribute];
				
				for (var i = 0; i < tReplaceStringArr.length; i++) {
					
					tText = tText.replace(/%%/, tReplaceStringArr[i]);
				}
			
				return tText;
			}

			return "This text does not exist.";
		}
		
		return "There are no texts loaded";	
	},
	
	/*
		Returns the month string of the language file by passing the date number	
	*/
	getMonthString: function(tMonth) {
	
		var tNamespace		=	tMonth.split('.')[0];
		var tAttribute		=	tMonth.split('.')[1];
		
		if (apa.data.language[tNamespace]) {
		
			if (apa.data.language[tNamespace].months) {
			
				return apa.data.language[tNamespace].months[tAttribute];
			}

			return "There are no months defined.";
		}
		
		return "There are no texts loaded";	
	},
	
	/*
		Returns the day string of the language file by passing the day number. 
		Possible return strings: monday, tuesday, ..
	*/
	getDayString: function(tDay) {
	
		var tNamespace		=	tDay.split('.')[0];
		var tAttribute		=	tDay.split('.')[1];
		
		if (apa.data.language[tNamespace]) {
		
			if (apa.data.language[tNamespace].days) {
			
				return apa.data.language[tNamespace].days[tAttribute];
			}

			return "There are no days defined.";
		}
		
		return "There are no texts loaded";	
	},
	
	
	/*
		Sets the language attribute into an element, converts ISO 639-2 to html5 compliant ISO 639-1
		
		@param tTag is the class-name of the element to add the attribute
		@param tCode is the ISO 639-2 language code that has to be converted and added
	*/

	set: function(tCode, frameId) {
	
		var tCode = this.getLanguage(tCode);
		
		japa('#' + frameId).attr('lang', tCode);
	},
		
	getLanguage: function(tCode) {
		
		var tLanguage = '';
		
		switch( tCode ) {
			
			case "deu": 
				tCode = 'de';
				break;
			case "gsw":
				tCode = 'de';
				break;
			case "fra":
				tCode = 'fr';
				break;
			case "eng":
				tCode = 'en';
				break;
			case "ita":
				tCode = 'it';
				break;
			case "spa":
				tCode = 'es';
				break;
			default:
				tCode = 'de';
		}
			
		return tCode;
	}
});