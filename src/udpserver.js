var udp = require("dgram");

function start(settings, store) {
	var server = udp.createSocket("udp4");

	server.on("message", function(msg) {
		console.log("server got: " + msg);
		store(msg);		
	});

	console.log("UDP server listening on: " + settings.udp_listen_port);
	server.bind(settings.udp_listen_port);
}

exports.start = start;