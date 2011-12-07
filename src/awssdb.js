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
