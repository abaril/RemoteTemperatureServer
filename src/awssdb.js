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

var simpledb = require('simpledb');
var winston = require("winston");
var domain = "com.allanbaril.tempmon";
var sdb;

function getvalue(key, callback) {
	sdb.getItem(domain, key, callback);
}

function store(value) {
	var toInsert = {
		"id": value.id, 
		"receiptDate": value.receiptDate, 
		"floor_5_temp": value.wall_router0.temperature.value, 
		"floor_5_light": value.wall_router0.light.value, 
		"floor_6_temp": value.sensor0.temperature.value, 
		"floor_6_light": value.sensor0.light.value
	};
	sdb.putItem(domain, value.receiptDate.toString(), toInsert, function(error) {
		if (error) {
			winston.error(JSON.stringify(error));
		}
	});
}

function init(awskeyid, awssecret) {
	winston.info("Initializing simpleDB ...");
	sdb = new simpledb.SimpleDB({"keyid": awskeyid, "secret": awssecret});
	sdb.createDomain(domain, function(error) {
		if (!error) {
			winston.info("Simple DB prep'd");
		} else {
			winston.error(JSON.stringify(error));
		}
	});
}

exports.init = init;
exports.store = store;
exports.getvalue = getvalue;
