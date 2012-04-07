// Copyright (c) 2012 Allan Baril
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
// and associated documentation files (the "Software"), to deal in the Software without restriction, 
// including without limitation the rights to use, copy, modify, merge, publish, distribute, 
// sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or 
// substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
// NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var winston = require("winston");
var data = [];
var settings = {};
var nextId = 1;
var dbfunc;

function parseDateValue(readingName, tokens) {
	var ret = {};
	
	ret.name = readingName;
	ret.date = tokens[1];
	ret.value = tokens[2];
	
	return ret;
}

function findSensor(sensors, sensorName) {
	for (sensor in sensors) {
		if (sensor.name === sensorName) {
			return sensor;
		}
	}
	
	var newSensor = { "name": sensorName, "readings": [] };
	ret.sensors.push(newSensor);
	return newSensor;
}

function parse(value) {

	if (value)
	{
		var currentTime = new Date();
		var ret = {
			"id": nextId++,
			"receiptDate": currentTime.getTime(), 
			"sensors": [],
		};
		
		var lines = value.toString().split("\n");
		for (line in lines) {
			var tokens = lines[line].split(",");
			var subtokens = tokens[0].split(".");
			
			var sensor = findSensor(ret.sensors, subtokens[0]);
			var reading = parseDateValue(subtokens[1], tokens);
			if (sensor && reading) {
				sensor.readings.push(reading);
			}
		}
		
		return ret;
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
			dbfunc(parsed);
		}
	} else {
		winston.warn("Received invalid data");	
	}
}

function getData2(count, start, interval) {
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
// DON'T STORE IN THE DB FOR NOW - dbfunc = dbfuncIn;
}

exports.init = init;
exports.store = store;
exports.getData = getData;
