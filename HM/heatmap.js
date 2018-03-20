(function(){
    var margin = { top: 20, right: 0, bottom: 50, left: 50},
          width = (window.innerWidth/2) - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 12),
          legendElementWidth = gridSize,
          buckets = 9,
		  colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],          
		  Names = ["PCLN","AMZN","GOOGL","GOOG","ISRG","AZO","MTD","REGN","CMG","EQIX"],
          Years = ["Jan", "Feb", "March", "Apr", "May", "June", "July", "Aug"];

      var svg = d3.select("#heatmap").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var dayLabels = svg.selectAll(".YearLabel")
          .data(Years)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 7) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = svg.selectAll(".NameLabel")
          .data(Names)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function(d, i) { return ((i >= 0 && i <= 14) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

        d3.json("HeatMapData.json",
        function(error, data) {
          var colorScale = d3.scale.quantile()
              .domain([2000, buckets - 1, d3.max(data, function (d) { return d.Units; })])
              .range(colors);

          var cards = svg.selectAll(".hour")
              .data(data, function(d) {return d.Year+':'+d.Name;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.Name - 1) * gridSize; })
              .attr("y", function(d) { return (d.Year - 1) * gridSize; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "hour bordered")
              // .attr("width", gridSize)
              .attr("width", gridSize)
              .attr("height", gridSize)
              .style("fill", colors[0]);

          cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.Units); });

          cards.select("title").text(function(d) { return d.Units; });
          
          cards.exit().remove();

          var legend = svg.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend");

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize);

          legend.exit().remove();

        });
})();