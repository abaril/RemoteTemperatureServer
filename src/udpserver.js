var winston = require("winston");
var udp = require("dgram");

function start(settings, store) {
	var server = udp.createSocket("udp4");

	server.on("message", function(msg) {
		winston.info("server got: " + msg);
		store(msg);		
	});

	winston.info("UDP server listening on: " + settings.udp_listen_port);
	server.bind(settings.udp_listen_port);
}

exports.start = start;