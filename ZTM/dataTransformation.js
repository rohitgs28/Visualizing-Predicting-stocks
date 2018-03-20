function transformCompanyMapping(arrCompanyMapping) {
	var lengthCompanyMapping = arrCompanyMapping.length;
	var objTransformedMappingInfo = {}
	for (var indexCompanyData = 0; indexCompanyData < lengthCompanyMapping; indexCompanyData++) {
		objTransformedMappingInfo[arrCompanyMapping[indexCompanyData].Name] = arrCompanyMapping[indexCompanyData].Sector;
	}
	return objTransformedMappingInfo;

}

var ObjTooltipGraphData = {};
var objStockPercentMapping = {};

function transformCSVToJSON(arrObjData, sectorMapping) {

	// d3.csv("CompanyToSectorMapping.csv", function (sectorMapping) {

	var arrTransformedData = [];
	var companyMapping = {};

	var lenArrObjData = arrObjData.length;
	var minDate = transformDateToRequiredFormat(objMapTimeDivision[strTypeOfMapping]["startDate"]);
	var maxDate = transformDateToRequiredFormat(objMapTimeDivision[strTypeOfMapping]["endDate"]);

	var objCurrData;
	var strCurrentCompanyName;

	var dataIndexToAdd = "Close";
	var dataIndexCompany = "Name";
	var dataIndexDate = "Date";

	var strSector;
	var strDate;

	for (var indexData = 0; indexData < lenArrObjData; indexData++) {
		objCurrData = arrObjData[indexData];
		strCurrentCompanyName = objCurrData[dataIndexCompany];
		// strDate = new Date(objCurrData[dataIndexDate]);
		strDate = transformDateToRequiredFormat(objCurrData[dataIndexDate]);

		//if within the date mentioned

		if (strDate > minDate && strDate < maxDate) {

			if (!ObjTooltipGraphData.hasOwnProperty(strCurrentCompanyName)) {
				ObjTooltipGraphData[strCurrentCompanyName] = [];
			}

			var objTmp = {
				date: strDate,
				close: objCurrData["Close"]
			};

			/* Record Stock Percent */
			if (!objStockPercentMapping.hasOwnProperty(strCurrentCompanyName)) {
				objStockPercentMapping[strCurrentCompanyName] = {
					minDate: strDate,
					minDateVal: objCurrData["Close"],
					maxDate: strDate,
					maxDateVal: objCurrData["Close"]
				};
			} else {

				if (objStockPercentMapping[strCurrentCompanyName].minDate > strDate) {
					objStockPercentMapping[strCurrentCompanyName].minDate = strDate;
					objStockPercentMapping[strCurrentCompanyName].minDateVal = objCurrData["Close"];
				}

				if (objStockPercentMapping[strCurrentCompanyName].maxDate < strDate) {
					objStockPercentMapping[strCurrentCompanyName].maxDate = strDate;
					objStockPercentMapping[strCurrentCompanyName].maxDateVal = objCurrData["Close"];
				}

			}

			ObjTooltipGraphData[strCurrentCompanyName].push(objTmp);

			if (!companyMapping.hasOwnProperty(strCurrentCompanyName)) {

				if (sectorMapping.hasOwnProperty(strCurrentCompanyName)) {
					strSector = sectorMapping[strCurrentCompanyName];
				} else {
					strSector = "Other";
				}

				companyMapping[strCurrentCompanyName] = arrTransformedData.length;

				arrTransformedData.push({
					"key": strCurrentCompanyName,
					"subregion": strSector,
					"region": "Stock Data",
					"date": strDate,
					"value": parseInt(objCurrData[dataIndexToAdd])
				});

			} else {

				if (arrTransformedData[companyMapping[strCurrentCompanyName]]["date"] < strDate) {
					arrTransformedData[companyMapping[strCurrentCompanyName]]["value"] = parseInt(objCurrData[dataIndexToAdd]);
				}

			}

		}

	}
	return arrTransformedData;
	console.log(arrTransformedData);

	// });

}

function transformDateToRequiredFormat(strDate) {
	/* var arrDate = strDate.split("-");
	var strTmp = arrDate[1];
	arrDate[1] = arrDate[0]
	arrDate[0] = strTmp; */

	// return new Date(arrDate.join("-"));
	return new Date(strDate);
}

function calculateStockPercent(newVal, oldVal, isReturnValInt) {
	var value = (newVal - oldVal) * 100 / newVal;

	if (isReturnValInt) {
		return value;
	}
	return value.toFixed(2) + "%"
}

function transformCodeToCompanyMapping(arrCompanyMapping) {

	var lenArrCompanyMapping = arrCompanyMapping.length;
	var objTmp;

	var arrTransformedData = [];

	for (var indexCompany = 0; indexCompany < lenArrCompanyMapping; indexCompany++) {

		objTmp = {
			key: arrCompanyMapping[indexCompany]["CODE"],
			value: arrCompanyMapping[indexCompany]["NAME"]
		};

		arrTransformedData.push(objTmp);
	}
	
	return arrTransformedData;

}
