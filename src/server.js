var winston = require("winston");
var http = require("http");
var url = require("url");

var indexHTML;

function start(settings, route, handle) {

	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		winston.info("Request for " + pathname + " received.");
		route(handle, pathname, response, request);
	}

	http.createServer(onRequest).listen(settings.http_listen_port);
	winston.info("Server has started on port: " + settings.http_listen_port);
}

exports.start = start;