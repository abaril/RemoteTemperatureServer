
var temperatures = require("./temperatures");

function start(response, request) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Values:\n");
	var values = temperatures.get();
	for (x in values) {
		var value = values[x];
		var receiptDate = new Date(value.receiptDate);
		response.write(receiptDate +  " - Sensor 0=" + value.sensor0.temperature.value + "C \n");
		response.write(receiptDate +  " - Sensor 1=" + value.wall_router0.temperature.value + "C \n");		
	}
	response.end();
}

exports.start = start;
