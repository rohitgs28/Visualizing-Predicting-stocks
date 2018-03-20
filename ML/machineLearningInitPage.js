var strCompanySelected = "MMM";
var strLinearRegression = "Close";
var strSVM = "Linear";
var boolIsLinear = false;

function init() {
	$.getJSON("companyMapping.json", function (companyMapping) {
		var cmpSearchList = d3.select("#searchList").selectAll("li");
		cmpSearchList.append("li")
		.data(companyMapping)
		.enter()
		.append("li")
		.attr("value", function (d) {
			return d.key;
		})
		.attr("class", "selectionOptionsList")
		.text(function (d) {
			return d.key + ": " + d.value;
		});

		$("ul[id*=searchList] li").click(function () {
			// alert($(this).html()); // gets innerHTML of clicked li
			// alert($(this).text()); // gets text contents of clicked li
			strCompanySelected = $(this).attr("value");
			updateSelectedValues();
			// alert($(this).attr("value"));
		});
	});

}

function onClickLinearRegression() {
	console.log("clicked");

	var arrCheckedValue = $('.clsLinearRegression :checked');
	var lenArrCheckedValues = arrCheckedValue.length;
	strLinearRegression = "";

	for (var indexCheckedVal = 0; indexCheckedVal < lenArrCheckedValues; indexCheckedVal++) {

		if (indexCheckedVal + 1 == lenArrCheckedValues) {
			strLinearRegression = strLinearRegression + arrCheckedValue[indexCheckedVal].value;
		} else {
			strLinearRegression = strLinearRegression + arrCheckedValue[indexCheckedVal].value + " | ";
		}
	}

	updateSelectedValues();
}
function onClickSVMSelection(strSelectedVal) {
	strSVM = strSelectedVal;
	console.log(strSelectedVal);
	updateSelectedValues();
}

function updateSelectedValues() {
	// var strCompanySelected = $("ul[id*=searchList] li").attr("value");
	// var checkedValue = $('.clsLinearRegression :checked').val();

	var htmlToBeSelected = document.getElementById("selectedOptions");
	if (boolIsLinear) {
		htmlToBeSelected.innerHTML = "Selected Values: " + strCompanySelected + " | " + strLinearRegression;

	} else {
		htmlToBeSelected.innerHTML = "Selected Values: " + strCompanySelected + " | " + strSVM;
	}

}

function onBtnSVMClick() {
	boolIsLinear = false;
	unhideComponentsOnSelection("idSVMSelections", "idLinearRegression");
	updateSelectedValues();
}

function onBtnLinearRegressionClick() {
	boolIsLinear = true;
	unhideComponentsOnSelection("idLinearRegression", "idSVMSelections");
	updateSelectedValues();
}

function unhideComponentsOnSelection(id, componentToHide) {
	document.getElementById(id).hidden = false;
	document.getElementById(componentToHide).hidden = true;
	// document.getElementById("btnPredict").hidden = false;
}

function onBtnPredictClick() {
	document.getElementById("btnPredict").disabled = true;

	if (boolIsLinear) {
		var strPythonFileName = "ml_new.py";
		var objData = {
			"name": strCompanySelected
		};
	} else {
		var strPythonFileName = "SVM.py";
		var objData = {
			"name": strCompanySelected,
			"Classifier":strSVM.toLowerCase()
		};
	}
	$.ajax({
		type: "POST",
		url: strPythonFileName, // give the name of python file
		data: objData, //
		async: true,
		success: function (backendResponse) {
			document.getElementById("btnPredict").disabled = false;
			if (backendResponse && backendResponse.hasOwnProperty("status") && backendResponse["status"] == "success") {
				var response = backendResponse['response'];
				processData(JSON.parse(response));
				// document.getElementById("result").innerHTML = response;
			} else {
				errorMessage = backendResponse['except'];
				alert(errorMessage);
			}
		},
		error: function (backendResponse) {
			document.getElementById("btnPredict").disabled = false;
			alert("Error sending data!");
		}
	});
}

function myFunction() {
	var input,
	filter,
	ul,
	li,
	a,
	i;
	input = document.getElementById("myInput");
	filter = input.value.toUpperCase();
	ul = document.getElementById("searchList");
	li = ul.getElementsByTagName("li");
	for (i = 0; i < li.length; i++) {
		a = li[i].textContent;
		if (a.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";

		}
	}
}

function onClickSearchList() {

	// alert($('#searchList li.selected'));
	// alert("ALERT!");
}
init();
updateSelectedValues();
