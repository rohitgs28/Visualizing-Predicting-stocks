/**
 *
 * DATA SOURCE:  http://www.census.gov/foreign-trade/statistics/country/
 *
 */
var
baseYear = 2016,
maxMonth = 7,
maxYear;

var objTmp = {};
var arrAggregatedVolumeData = [];

function fetchData() {

	// d3.csv("stockTrade.csv", function (csv) {
	d3.csv("Dataset/all_stocks_1yr.csv", function (csv) {
		var normalized = [];
		var row;
		var newRow;
		var date;

		var csvDataLength = csv.length;
		for (var i = 0; i < csvDataLength; i++) {
			row = csv[i];
			newRow = {};

			date = new Date(row.Date);
			newRow.Year = date.getFullYear();
			newRow.Month = row.Date.split("-")[1];

			if (!baseYear) {
				baseYear = newRow.Year;
			}
			if (baseYear > newRow.Year) {
				baseYear = newRow.Year;
			}

			if (!maxYear || maxYear < newRow.Year) {
				maxYear = newRow.Year;
			}
			if (maxMonth < newRow.Month) {
				maxMonth = newRow.Month;
			}

			newRow.Country = row.Name;
			newRow.Imports = Number(row["Open"]);
			newRow.Exports = Number(row["Close"]);

			strMap = newRow.Year + newRow.Month + newRow.Country;

			if (!objTmp.hasOwnProperty(newRow.Country)) {
				objTmp[newRow.Country] = {};
			}

			if (!objTmp[newRow.Country].hasOwnProperty(newRow.Year)) {
				objTmp[newRow.Country][newRow.Year] = {};
			}

			if (!objTmp[newRow.Country][newRow.Year].hasOwnProperty(newRow.Month)) {
				objTmp[newRow.Country][newRow.Year][newRow.Month] = {
					"Date": date,
					"Volume": row["Volume"],
					"Close": row["Close"],
					"Open": row["Open"],
					"index": normalized.length
				};
			
			arrAggregatedVolumeData[objTmp[newRow.Country][newRow.Year][newRow.Month]["index"]] = parseInt(row["Volume"]);
			} else {
				if (objTmp[newRow.Country][newRow.Year][newRow.Month]["Date"] < date) {
					objTmp[newRow.Country][newRow.Year][newRow.Month].Date = date;
					objTmp[newRow.Country][newRow.Year][newRow.Month].Close = row["Close"];
					objTmp[newRow.Country][newRow.Year][newRow.Month].Open = row["Open"];

					var strIndex = objTmp[newRow.Country][newRow.Year][newRow.Month].index;
					normalized[strIndex] = newRow;
				}
				
				arrAggregatedVolumeData[objTmp[newRow.Country][newRow.Year][newRow.Month]["index"]] += parseInt(row["Volume"]);
			}
			
			

			if (!objTmp.hasOwnProperty(strMap)) {
				objTmp[strMap] = Number(row["Close"]);
				normalized.push(newRow);
			}
		}

		countriesGrouped = d3.nest()
			.key(function (d) {
				return d.Year;
			})
			.key(function (d) {
				return d.Month;
			})
			.entries(normalized);

		//Sum total deficit for each month
		var totalImport = 0;
		var totalExport = 0;

		for (var y = 0; y < countriesGrouped.length; y++) {
			var yearGroup = countriesGrouped[y];
			for (var m = 0; m < yearGroup.values.length; m++) {
				var monthGroup = yearGroup.values[m];
				for (var c = 0; c < monthGroup.values.length; c++) {
					var country = monthGroup.values[c];
					totalImport = Number(totalImport) /* + Number(country.Imports) */ /* * 10000000 */;
					totalExport = Number(totalExport) /* + Number(country.Exports) */ /* * 10000000 */;
				}
				//    console.log("totalExport=" + String(totalExport));
				monthlyExports.push(totalExport);
				monthlyImports.push(totalImport);
			}

		}

		initialize();
		//Start running
		run();
		refreshIntervalId = setInterval(run, delay);
	});

}
