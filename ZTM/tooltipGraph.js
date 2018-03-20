
function sortByDateAscending(a, b) {
	// Dates will be cast to numbers automagically:
	return a.date - b.date;
}

function showGraph(strCompanyName) {
	var svg = d3.select("#svgTooltip");
	var margin = {
		top: 20,
		right: 20,
		bottom: 30,
		left: 20
	},
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom;

	g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.time.scale()
		.rangeRound([0, width]);

	var y = d3.scale.linear()
		.rangeRound([height, 0]);

	var line = d3.svg.line()
		.x(function (d) {
			return x(d.date);
		})
		.y(function (d) {
			return y(d.close);
		});

	var data = ObjTooltipGraphData[strCompanyName];
	data.sort(sortByDateAscending);
	
	x.domain(d3.extent(data, function (d) {
			return d.date;
		}));
	y.domain(d3.extent(data, function (d) {
			return d.close;
		}));

	g.append("path")
	.datum(data)
	.attr("fill", "none")
	.attr("class", "tooltipSVGGraph")
	// .attr("stroke", "steelblue")
	.attr("stroke-linejoin", "round")
	.attr("stroke-linecap", "round")
	.attr("stroke-width", 1.5)
	.attr("d", line);

}
