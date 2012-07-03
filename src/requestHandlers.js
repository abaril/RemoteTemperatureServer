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
var temperatures = require("./temperatures");
var temperatures2 = require("./temperatures2");
var fs = require("fs");
var url = require("url");
var awssdb = require("./awssdb");

var indexHTML;
var jquery;
var chart;
var css;
var backbone;
var underscore;

function init(settings) {
	fs.readFile(settings.html_directory + "index.html", function(error, content) {
		indexHTML = content;
	});
	fs.readFile(settings.html_directory + "jquery-1.7.1.js", function(error, content) {
		jquery = content;
	});
	fs.readFile(settings.html_directory + "chart.js", function(error, content) {
		chart = content;
	});
	fs.readFile(settings.html_directory + "index.css", function(error, content) {
		css = content;
	});
	fs.readFile(settings.html_directory + "backbone.js", function(error, content) {
		backbone = content;
	});
	fs.readFile(settings.html_directory + "underscore.js", function(error, content) {
		underscore = content;
	});
}

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

function chart(response, request) {
	response.writeHead(200, {"Content-Type": "text/javascript"});
	response.write(chart);
	response.end();
}

function css(response, request) {
	response.writeHead(200, {"Content-Type": "text/css"});
	response.write(css);
	response.end();
}

function underscore(response, request) {
	response.writeHead(200, {"Content-Type": "text/javascript"});
	response.write(underscore);
	response.end();
}

function backbone(response, request) {
	response.writeHead(200, {"Content-Type": "text/javascript"});
	response.write(backbone);
	response.end();
}


function get_data(response, request) {
	var params = url.parse(request.url, true).query;
	var count = 20;
	var start = 0;
	var interval = 0;
	if ((typeof params["count"]) === "string") {
		count = parseInt(params["count"]);
		if (count > 100) {
			count = 100;
		}
	}
	if ((typeof params["start"]) === "string") {
		start = parseInt(params["start"]);
	}
	if ((typeof params["interval"]) === "string") {
		interval = parseFloat(params["interval"]);
	}

	winston.debug("get_data " + count + " items, starting at " + start + " with interval " + interval);

	response.writeHead(200, {"Content-Type": "text/javascript"});
	response.write(JSON.stringify(temperatures.getData(count, start, interval)));
	response.end();
}

function get_data2(response, request) {
	var params = url.parse(request.url, true).query;
	var count = 20;
	var start = 0;
	var interval = 0;
	if ((typeof params["count"]) === "string") {
		count = parseInt(params["count"]);
		if (count > 100) {
			count = 100;
		}
	}
	if ((typeof params["start"]) === "string") {
		start = parseInt(params["start"]);
	}
	if ((typeof params["interval"]) === "string") {
		interval = parseFloat(params["interval"]);
	}

	winston.debug("get_data " + count + " items, starting at " + start + " with interval " + interval);

	response.writeHead(200, {"Content-Type": "text/javascript"});
	response.write(JSON.stringify(temperatures2.getData(count, start, interval)));
	response.end();
}


function sdb_getvalue(response, request) {
	var params = url.parse(request.url, true).query;
	var timestamp = params["timestamp"];
	
	awssdb.getvalue(timestamp, function(error, result) {
		response.writeHead(200, {"Content-Type": "text/javascript"});
		response.write(JSON.stringify(result));
		response.end();
	});
}

exports.init = init;
exports.index = index;
exports.jquery = jquery;
exports.chart = chart;
exports.css = css;
exports.backbone = backbone;
exports.underscore = underscore;
exports.get_data = get_data;
exports.get_data2 = get_data2;
exports.sdb_getvalue = sdb_getvalue;