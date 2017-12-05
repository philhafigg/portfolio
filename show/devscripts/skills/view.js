brain.namespace.extend( 'visual.show.skills.view', function(frameId) {

	$.extend( this, new brain.view() );

	this.get = function(content) {


		var tHeader	=	['three', 'dev'];
		var	that	=	this;
		var config	=	brain.items[ this.frameId ].config;
		var tHtml	=	'';
		tHtml		+=	'<div class="info-box"></div>';
		tHtml		+=	'<svg></svg>';
		tHtml		+=	'<section>';
		tHtml		+=	'<ul>';
		
		$.each(tHeader, function(){
			
			var tElement = this;
		
			
			tHtml		+=	'<h1>' + brain.language.getText(this) + '</h1>';
			tHtml		+=	'<ul>';
		
			$.each(content.links, function(){
				
				if (this.source == tElement) {
					
					tHtml		+=	'<li>' + brain.language.getText('detail_' + this.target) + '</li>';
				}
			});
			
			tHtml		+=	'</ul>';

		});
		
		tHtml		+=	'</section>';

		return tHtml;
	};
	
	this.createSVG = function(content) {
		
		var width = $('svg').width();
		var height = $('svg').height()+150;

		var svg = d3.select("svg").attr("width", '100%')
		.attr("height", height)
		.attr('viewBox','0 0 '+ width +' '+ height)
		.attr('preserveAspectRatio','xMinYMin meet');
		
		var defs = svg.append("defs").attr("id", "imgdefs")
		
		$.each(content.nodes, function() {
			
			var tElement	=	this;
			
			var pattern = defs.append("pattern")
                        .attr("id", tElement.id)
                        .attr("height", 1)
                        .attr("width", 1)
                        .attr("x", "0")
                        .attr("y", "0");

			pattern.append("image")
			
			.attr("x", 0)
			.attr("y", 0)
			.attr("height", 60)
			.attr("width", 60)
			.attr("xlink:href", "content/images/skills/" + tElement.id + ".svg");
		});
		
		var color = d3.scaleOrdinal(d3.schemeCategory20);
		
		var simulation = d3.forceSimulation()
		.force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d){
			
			return d.value;
		}))
		.force("charge", d3.forceManyBody().strength(-500))
		.force("center", d3.forceCenter(width / 2, height / 2));
		
		var link = svg.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(content.links)
		.enter().append("line")
		.attr("stroke-width", 1)
		
/*
		var nodeGrp = svg.append("g")
		.attr("class", "nodeGroups")
		.selectAll("g")
		.data(content.nodes)
		.enter().append("g");
*/

		var node = svg.append("g")
		.attr("class", "nodes")
		.selectAll("circle")
		.data(content.nodes)
		.enter().append("circle")
		.attr("r", 30)
		.style("stroke-width", 0.7) 
		.attr("fill", function(d) {
			
			return "url(#" + d.id + ")";	
		})
		.attr("id", function(d) {
			
			return d.id;	
		})
		.call(d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended));
		
		node.append("title")
		.text(function(d) { return d.id; });
		
		node.append("text")
		.text(function(d) { return d.id; });

		simulation
		.nodes(content.nodes)
		.on("tick", ticked);
		
		simulation.force("link")
		.links(content.links);
		
		function ticked() {
		link
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });
		
		node
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });
		}
		
		function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
		}
		
		function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
		}
		
		function dragended(d) {
		if (!d3.event.active) simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
		}
		}
});
