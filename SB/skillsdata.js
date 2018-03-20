var xAxis = "yAxis";
var monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

function transformData(p_arrObjData) {

	objTransformedData = {};
	var lenArrObjData = p_arrObjData.length;
	var objTmpCurrData;

	var interJSON = getTransformationJSONForSunburst();
	interJSON = interJSON.SunburstChart;

	var strParentKey = interJSON.ParentKey;

	var objTmpCurrentTransformation;
	var groupByIndex;
	var strDate;

	for (var indexData = 0; indexData < lenArrObjData; indexData++) {
		objTmpCurrData = p_arrObjData[indexData];
		groupByIndex = objTmpCurrData[strParentKey];
		strDate = new Date(objTmpCurrData["date"]);

		if (!objTransformedData.hasOwnProperty(groupByIndex)) {
			objTransformedData[groupByIndex] = {};
			// objTransformedData[groupByIndex]["yAxis"] = [];
		}

		// if (objTransformedData[groupByIndex]["yAxis"].indexOf(strDate[getYAxisAttribute()]()) == -1) {
			// objTransformedData[groupByIndex]["yAxis"].push(strDate[getYAxisAttribute()]());
		// }

		for (var key in interJSON) {
			if (interJSON.hasOwnProperty(key) && key != "ParentKey") {

				if (!objTransformedData[groupByIndex].hasOwnProperty(interJSON[key]["UILabel"])) {
					objTransformedData[groupByIndex][interJSON[key]["UILabel"]] = [];
				}

				objTransformedData[groupByIndex][interJSON[key]["UILabel"]].push(parseInt(objTmpCurrData[key]));
			}
		}
	}

	var finalData = {
		"Stock": objTransformedData
	};

	return finalData
}

function getYAxisAttribute(){
	
	return "getMonth"
	
	
}

function getYAxisScaleVal() {
	//return [2009, 2010, 2011, 2012, 2013, 2014, 2015,2016,2017];
	// return [01, 02, 03, 04, 05, 06, 07, 08];
	return [01, 02, 03, 04, 05, 06, 07, 08];
}

var skillsdata;

skillsdata = {
	"Stock": {
		"Apple": {
			"Volume": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 30, 50, 50, 50],

			"Open": [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 40, 40, 50, 50, 50],

			"Close": [0, 0, 20, 40, 50, 50, 50, 50, 60, 80, 90, 95, 95],

			"High": [0, 0, 0, 0, 0, 0, 0, 10, 30, 50, 50, 50, 45, 45, 40],

			"Low": [0, 0, 0, 0, 0, 0, 0, 10, 30, 50, 50, 50, 45, 45, 40]

		},
		"Google": {
			"Volume": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 30, 50, 50, 50],

			"Open": [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 40, 40, 50, 50, 50],

			"Close": [0, 0, 20, 40, 50, 50, 50, 50, 60, 80, 90, 95, 95],

			"High": [0, 0, 0, 0, 0, 0, 0, 10, 30, 50, 50, 50, 45, 45, 40],

			"Low": [0, 0, 0, 0, 0, 0, 0, 10, 30, 50, 50, 50, 45, 45, 40],

		}
	}
};
