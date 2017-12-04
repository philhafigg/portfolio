apa.namespace.extend( 'setup.scripts.client', function() {
	
	japa.extend( this, new apa.setup['scripts']() );
	
	this.getUrl = function(type, name) {
		
		return apa.params.paths[ type ].script + '/' + type + '.' + name + '.js';
	};
});