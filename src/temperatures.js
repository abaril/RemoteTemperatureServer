
var data = [];
var settings = {};
var nextId = 1;

function parseDateValue(tokens) {
	var ret = {};
	
	ret.date = tokens[1];
	ret.value = tokens[2];
	return ret;
}

function parse(value) {
	// TODO: would probably make sense to make parsing more generic ... 
	var currentTime = new Date();
	var ret = {
		"id": nextId++,
		"receiptDate": currentTime.getTime(), 
		"sensor0": {}, 
		"wall_router0": {}
	};
	
	var lines = value.toString().split("\n");
	for (line in lines) {
		var tokens = lines[line].split(",");
		if (tokens[0] === "sensor0.temperature") {
			ret.sensor0.temperature = parseDateValue(tokens);
		}
		else if (tokens[0] === "sensor0.low_battery") {
			ret.sensor0.battery = parseDateValue(tokens);
		}
		else if (tokens[0] === "sensor0.light") {
			ret.sensor0.light = parseDateValue(tokens);
		}
		else if (tokens[0] === "wall_router0.light") {
			ret.wall_router0.light = parseDateValue(tokens);
		}
		else if (tokens[0] === "wall_router0.temperature") {
			ret.wall_router0.temperature = parseDateValue(tokens);
		}
	}
	
	return ret;
}

function store(value) {
	var parsed = parse(value);
	console.log(JSON.stringify(parsed));

	var length = data.unshift(parsed);
	if (length > settings.max_samples) {
		console.log("Cleaning house");
		data.pop();
	}
}

function getData(count, start) {
	if (start > 0) {
		if (data[0].id > start) {
			start = data[0].id - start;
		}
		if (start >= data[data.length - 1].id) {
			// out of bounds
			start = 0;
			count = 0;
		}
	} else {
		start = 0;
	}
	console.log("Returning " + start + " num " + count);

	return data.slice(start, count);
}

function init(value) {
	settings = value;
}

exports.init = init;
exports.store = store;
exports.getData = getData;