
var temperatures = require("./temperatures");
var fs = require("fs");

var indexHTML;
var jquery;

fs.readFile("../html/index.html", function(error, content) {
	indexHTML = content;
});
fs.readFile("../html/jquery-1.7.1.js", function(error, content) {
	jquery = content;
});

// TODO: find a better way to serve static content ...
function index(response, request) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(indexHTML);
	response.end();
}

function jquery(response, request) {
	response.writeHead(200, {"Content-Type": "text/javascript"});
	response.write(jquery);
	response.end();
}

function get_data(response, request) {
	response.writeHead(200, {"Content-Type": "text/javascript"});
	response.write(JSON.stringify(temperatures.get()));
	response.end();
}

exports.index = index;
exports.jquery = jquery;
exports.get_data = get_data;
