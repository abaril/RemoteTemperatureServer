var winston = require("winston");

function route(handle, pathname, response, request) {
	winston.debug("About to route a request for " + pathname);
	if (typeof handle[pathname] === 'function') {
		return handle[pathname](response, request);
	} else {
		winston.info("No request handler found for " + pathname);
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not Found");
		response.end();
	}
}

exports.route = route;