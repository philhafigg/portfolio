QUnit.module( 'namespace');

QUnit.test( '0: Initialization - Assert that all namespaces that are not built directly by spine-components are present', function( assert ) {
	
	assert.equal( japa(apa).length, 1, 'apa namespace' );
	assert.equal( japa(apa.data).length, 1, 'apa.data namespace was built' );
	assert.equal( japa(apa.device).length, 1, 'apa.device namespace was built' );
	assert.equal( japa(apa.items).length, 1, 'apa.items was built' );
	assert.equal( japa(apa.visual).length, 1, 'apa.visual was built' );
});

QUnit.test('1: Basic extend,  an object is added directly to apa.', function( assert ) {
	
	var component = new function() {
		
		this.init = function() {};
	}
	
	apa.namespace.extend( 'test1', component );
	
	assert.equal( japa(apa.test1).length, 1, 'apa.test1 was built');
	assert.deepEqual( apa.test1, component, 'apa.test1 is identical to the test object' );
});

QUnit.test('2: Advanced extend, 1 namespace is skipped and should be added automatically as object', function(assert) {
	
	var component = function() {
		
		this.init = function() {};
	}
	
	apa.namespace.extend( 'test2.component', component );
	
	assert.equal( japa(apa.test2).length, 1, 'apa.test2 was built' );
	assert.equal( japa(apa.test2.component).length, 1, 'apa.test2.component was built' );
	assert.equal( typeof apa.test2, 'object', 'apa.test2 is an object as expected' );
	assert.equal( typeof apa.test2.component, 'function', 'apa.test2.component is a function as expected' );
	assert.deepEqual( apa.test2.component, component, 'apa.test2.component is identical to the test object' );
});

QUnit.test('3: Advanced extend, 1 namespace is skipped and filled afterwards - the function that was added before still has to be present and working', function(assert) {
	
	var childComponent = function() {
		
		this.init = function() { return 'childComponent.init' };
	}
	
	var parentComponent = function() {
		
		this.init = function() { return 'parentComponent.init' };
	}
	
	apa.namespace.extend( 'parent.child', childComponent );
	apa.namespace.extend( 'parent', parentComponent );
	
	assert.equal( japa(apa.parent).length, 1, 'apa.parent was built');
	assert.equal( japa(apa.parent.child).length, 1, 'apa.parent.child was built');
	
	var parent	=	new apa.parent();
	var child	=	new apa.parent.child();
	
	assert.equal( parent.init(), 'parentComponent.init', 'apa.parent.init is working');
	assert.equal( child.init(), 'childComponent.init', 'apa.parent.child.init is working');
});