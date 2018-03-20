fetchData();
var month = -1;
function run() {
	if (month < maxMonth) {
		month++;
	} else {
		month = 0;
		if (year < countriesGrouped.length - 1) {
			year++;
		}
	}
	if (month == maxMonth && year == countriesGrouped.length - 1) {
		month = 0;
		year = 0;
	}
	update(year, month);
}

