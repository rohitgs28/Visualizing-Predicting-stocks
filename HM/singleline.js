function generateLineChart(p_data){
    debugger;
if(d3.select('#singleLineSVG')[0][0] != null){
    d3.select('#singleLineSVG').remove();
} 
// Set the dimensions of the canvas / graph
var margin = { top: 0, right: 100, bottom: 50, left: 50},
    width = (window.innerWidth) - margin.left - margin.right,
    height = (window.innerHeight/2) - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%d-%b-%y").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(12);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });
    
// Adds the svg canvas
var svg = d3.select("#singleline").append("svg")
        .attr("id", "singleLineSVG")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json("singleLineData.json", function(error, data) {
    data = data[p_data.Name][p_data.Year];
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = d.close;
    }.bind(p_data));

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.close; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

});}