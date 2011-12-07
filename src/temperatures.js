var winston = require("winston");
var data = [];
var settings = {};
var nextId = 1;
var dbfunc;

function parseDateValue(tokens) {
	var ret = {};
	
	ret.date = tokens[1];
	ret.value = tokens[2];
	return ret;
}

function parse(value) {

	var valid = false;
	if (value)
	{
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
				valid = true;				
			}
			else if (tokens[0] === "sensor0.low_battery") {
				ret.sensor0.battery = parseDateValue(tokens);
				valid = true;				
			}
			else if (tokens[0] === "sensor0.light") {
				ret.sensor0.light = parseDateValue(tokens);
				valid = true;				
			}
			else if (tokens[0] === "wall_router0.light") {
				ret.wall_router0.light = parseDateValue(tokens);
				valid = true;				
			}
			else if (tokens[0] === "wall_router0.temperature") {
				ret.wall_router0.temperature = parseDateValue(tokens);
				valid = true;
			}
		}
		
		if (valid) {
			return ret;
		}
	}
}

function store(value) {
	var parsed = parse(value);
	if (parsed) {
		winston.debug(JSON.stringify(parsed));
	
		var length = data.unshift(parsed);
		if (length > settings.max_samples) {
			data.pop();
		}
		
		if (dbfunc) {
			dbfunc(value);
		}
	} else {
		winston.warn("Received invalid data");	
	}
}

function getData(count, start, interval) {
	if (data.length <= 0) {
		return data;
	}

	if (start > 0) {
		if ((data[0].id >= start) && (start >= data[data.length - 1].id)) {
			start = data[0].id - start;
		} else {
			// out of bounds
			start = 0;
			count = 0;
		}
	} else {
		start = 0;
	}
	winston.debug("Returning " + start + " num " + count);

	if (interval === 0) {
		return data.slice(start, start+count);
	} else {
		var lastTime = data[start].receiptDate;
		var result = [];
		var i = start + 1;
		
		result.push(data[start]);
		while ((result.length < count) && (i < data.length)) {
			if ((lastTime - data[i].receiptDate) >= (interval * 60 * 1000)) {
				lastTime = data[i].receiptDate;
				result.push(data[i]);
			}
			i += 1;
		}
		return result;
	}
}

function init(value, dbfuncIn) {
	winston.info("Initializing temperatures ...");
	settings = value;
	dbfunc = dbfuncIn;
}

exports.init = init;
exports.store = store;
exports.getData = getData;