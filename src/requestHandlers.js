
var temperatures = require("./temperatures");
var fs = require("fs");
var url = require("url");

var indexHTML;
var jquery;
var css;

fs.readFile("../html/index.html", function(error, content) {
	indexHTML = content;
});
fs.readFile("../html/jquery-1.7.1.js", function(error, content) {
	jquery = content;
});
fs.readFile("../html/index.css", function(error, content) {
	css = content;
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

function css(response, request) {
	response.writeHead(200, {"Content-Type": "text/css"});
	response.write(css);
	response.end();
}

function get_data(response, request) {
	var params = url.parse(request.url, true).query;
	var count = 20;
	if ((typeof params["count"]) === "string") {
		count = parseInt(params["count"]);
		if (count > 40) {
			count = 40;
		}
	}

	console.log("get_data " + count + " items.");


	response.writeHead(200, {"Content-Type": "text/javascript"});
	response.write(JSON.stringify(temperatures.getData(count)));
	response.end();
}

exports.index = index;
exports.jquery = jquery;
exports.css = css;
exports.get_data = get_data;
