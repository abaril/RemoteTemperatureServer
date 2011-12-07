var simpledb = require('simpledb');
var winston = require("winston");
var domain = "com.allanbaril.tempmon";
var sdb;

function getvalue(key, callback) {
	sdb.getItem(domain, key, callback(error, result));
}

function store(value) {
	sdb.putItem(domain, value.receiptDate.toString(), value, function(error) {
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
