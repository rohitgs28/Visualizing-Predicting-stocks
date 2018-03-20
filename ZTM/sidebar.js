function initializeSidebarCompanyMapping() {

	d3.csv("Dataset/companyToFullFormMapping.csv", function (stockMapping) {
		var companyMapping = transformCodeToCompanyMapping(stockMapping);
		
		var cmpSearchList = d3.select("#searchList").selectAll("li");
		cmpSearchList.append("li")
		.data(companyMapping)
		.enter()
		.append("li")
		.attr("value", function (d) {
			return d.value;
		})
		.attr("class", "selectionOptionsList")
		.text(function (d) {
			return d.key +": " + d.value;
		});
		console.log(stockMapping);

	})

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

initializeSidebarCompanyMapping();