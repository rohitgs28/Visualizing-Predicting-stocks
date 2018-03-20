function createChart(JSONData, data, objLegendData, p_str) {
	// predictedVal
	var height = 300;
	var width = 600;
	var margin = {
		top: 50,
		right: 20,
		bottom: 50,
		left: 20
	};

	// formatters for axis and labels
	var currencyFormat = d3.format("$0.2f");
	var decimalFormat = d3.format("0.2f");

	var svg = d3.select("#divMainPage")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
	.attr("class", "y axis");

	svg.append("g")
	.attr("class", "x axis");

	var xScale = d3.scale.ordinal()
		.rangeRoundBands([margin.left, width], .1);

	var yScale = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

	var xLabels = JSONData.dateList;
	xScale.domain(xLabels);
	// yScale.domain([Math.round(d3.min(JSONData.price_list)), Math.round(d3.max(JSONData.price_list))]);
	yScale.domain([0, Math.round(d3.max(JSONData.price_list))]);

	var line = d3.svg.line()
		.x(function (d) {
			return xScale(d['dateList']);
		})
		.y(function (d) {
			return yScale(d['price_list']);
		});

	svg.append("path")
	.datum(data)
	.attr("class", "line")
	.attr("d", line);

	svg.select(".x.axis")
	.attr("transform", "translate(0," + (height) + ")")
	.call(xAxis.tickValues(xLabels.filter(function (d, i) {
				if (i % 12 == 0)
					return d;
			})))
	.selectAll("text")
	.style("text-anchor", "end")
	.attr("transform", function (d) {
		return "rotate(-45)";
	});

	svg.select(".y.axis")
	.attr("transform", "translate(" + (margin.left) + ",0)")
	.call(yAxis.tickFormat(currencyFormat));

	// chart title
	svg.append("text")
	.attr("x", (width + (margin.left + margin.right)) / 2)
	.attr("y", 0 + margin.top)
	.attr("text-anchor", "middle")
	.style("font-size", "16px")
	.style("font-family", "sans-serif")
	.text(""); //TODO:

	// x axis label
	svg.append("text")
	.attr("x", (width + (margin.left + margin.right)) / 2)
	.attr("y", height + margin.bottom)
	.attr("class", "text-label")
	.attr("text-anchor", "middle")
	.text("Date");

	// get the x and y values for least squares
	var xSeries = d3.range(1, xLabels.length + 1);
	var ySeries = data.map(function (d) {
			return parseFloat(d['price_list']);
		});

	var leastSquaresCoeff = leastSquares(xSeries, ySeries);

	// apply the reults of the least squares regression
	var x1 = xLabels[0];
	var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
	var x2 = xLabels[xLabels.length - 1];
	var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
	var trendData = [[x1, y1, x2, y2]];
	if (boolIsLinear) {
		var trendline = svg.selectAll(".trendline")
			.data(trendData);

		trendline.enter()
		.append("line")
		.attr("class", "trendline")
		.attr("x1", function (d) {
			return xScale(d[0]);
		})
		.attr("y1", function (d) {
			return yScale(d[1]);
		})
		.attr("x2", function (d) {
			return xScale(d[2]);
		})
		.attr("y2", function (d) {
			return yScale(d[3]);
		})
		.attr("stroke", "black")
		.attr("stroke-width", 1);
	}

	// display equation on the chart
	if (boolIsLinear) {
		svg.append("text")
		/*.text("eq: " + decimalFormat(leastSquaresCoeff[0]) + "x + " +
		decimalFormat(leastSquaresCoeff[1])) */
		.text(p_str + " RMS: " + objLegendData.RMS.toFixed(2))
		.attr("class", "text-label")
		.attr("x", function (d) {
			return xScale(x2) - 60;
		})
		.attr("y", function (d) {
			return yScale(y2) - 30;
		});
	}

	// display r-square on the chart
	svg.append("text")
	.text("Predicted Value: " + objLegendData.PredictedPrice.toFixed(2) + " Accuracy: " + objLegendData.Accuracy.toFixed(2))
	.attr("class", "text-label")
	.attr("x", function (d) {
		return xScale(x2) - 60;
	})
	.attr("y", function (d) {
		return yScale(y2) - 10;
	});
}
// returns slope, intercept and r-square of the line
function leastSquares(xSeries, ySeries) {
	var reduceSumFunc = function (prev, cur) {
		return prev + cur;
	};

	var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
	var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

	var ssXX = xSeries.map(function (d) {
			return Math.pow(d - xBar, 2);
		})
		.reduce(reduceSumFunc);

	var ssYY = ySeries.map(function (d) {
			return Math.pow(d - yBar, 2);
		})
		.reduce(reduceSumFunc);

	var ssXY = xSeries.map(function (d, i) {
			return (d - xBar) * (ySeries[i] - yBar);
		})
		.reduce(reduceSumFunc);

	var slope = ssXY / ssXX;
	var intercept = yBar - (xBar * slope);
	var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

	return [slope, intercept, rSquare];
}

function processData(JSONData) {
	d3.selectAll("#divMainPage svg").remove();
	var linearRegressionVals = strLinearRegression.toUpperCase();
	var arrGraphVals = linearRegressionVals.split(" | ");
	//If closing
	if (arrGraphVals.indexOf("CLOSE") != -1 || !boolIsLinear) {
		var arrTransformedData = transformData(JSONData.dates, JSONData.values.Close.Data);
		var objJSONData = {
			dateList: JSONData.dates,
			price_list: JSONData.values.Close.Data
		};

		var legendData = {
			"Accuracy": JSONData.values.Close.Accuracy,
			"PredictedPrice": JSONData.values.Close.PredictedPrice
		};

		if (boolIsLinear) {
			legendData["RMS"] = JSONData.values.Close.RMS;
		}
		createChart(objJSONData, arrTransformedData, legendData, "Close");
	}

	//If opening
	if (arrGraphVals.indexOf("OPEN") != -1 || !boolIsLinear) {
		var arrTransformedData = transformData(JSONData.dates, JSONData.values.Open.Data);
		var objJSONData = {
			dateList: JSONData.dates,
			price_list: JSONData.values.Open.Data
		};

		var legendData = {
			"Accuracy": JSONData.values.Open.Accuracy,
			"PredictedPrice": JSONData.values.Open.PredictedPrice
		};
		if (boolIsLinear) {
			legendData["RMS"] = JSONData.values.Open.RMS;
		}
		createChart(objJSONData, arrTransformedData, legendData, "Open");
	}

	//If high
	if (arrGraphVals.indexOf("HIGH") != -1 || !boolIsLinear) {
		var arrTransformedData = transformData(JSONData.dates, JSONData.values.High.Data);
		var objJSONData = {
			dateList: JSONData.dates,
			price_list: JSONData.values.High.Data
		};

		var legendData = {
			"Accuracy": JSONData.values.High.Accuracy,
			"PredictedPrice": JSONData.values.High.PredictedPrice
		};

		if (boolIsLinear) {
			legendData["RMS"] = JSONData.values.High.RMS;
		}
		createChart(objJSONData, arrTransformedData, legendData, "High");
	}

	//If low
	if (arrGraphVals.indexOf("LOW") != -1 || !boolIsLinear) {
		var arrTransformedData = transformData(JSONData.dates, JSONData.values.Low.Data);
		var objJSONData = {
			dateList: JSONData.dates,
			price_list: JSONData.values.Low.Data
		};

		var legendData = {
			"Accuracy": JSONData.values.Low.Accuracy,
			"PredictedPrice": JSONData.values.Low.PredictedPrice
		};
		if (boolIsLinear) {
			legendData["RMS"] = JSONData.values.Low.RMS;
		}
		createChart(objJSONData, arrTransformedData, legendData, "Low");
	}
}

function transformData(dateList, priceList) {
	var lenJSONData = dateList.length;
	var arrTransformedData = [];
	var objTmp;
	for (var indexJSON = 0; indexJSON < lenJSONData; indexJSON++) {
		objTmp = {
			dateList: dateList[indexJSON],
			price_list: priceList[indexJSON]
		};
		arrTransformedData.push(objTmp);
	}
	return arrTransformedData;
}
