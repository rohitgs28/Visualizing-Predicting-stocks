function sendData() {
	if (boolIsLinear) {
		var strPythonFileName = "ml_new.py";
		var objData = {
			"name": "AAPL"
		};
	} else {
		var strPythonFileName = "SVM.py";
		var objData = {
			"name": "AAPL"
		};

	}

	$.ajax({
		type: "POST",
		url: "ml_new.py", // give the name of python file
		data: objData, //
		async: true,
		success: function (backendResponse) {
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
			alert("Error sending data!");
		}
	});
}
