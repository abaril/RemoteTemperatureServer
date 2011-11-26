
var data = [];
var settings = {};

function parseDateValue(tokens) {
	var ret = {};
	
	ret.date = tokens[1];
	ret.value = tokens[2];
	return ret;
}

function parse(value) {
	// TODO: would probably make sense to make parsing more generic ... 
	var currentTime = new Date();
	var ret = {"receiptDate": currentTime.getTime(), "sensor0": {}, "wall_router0": {}};
	
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

function get() {
	return data;
}

function init(value) {
	settings = value;
}

exports.init = init;
exports.store = store;
exports.get = get;