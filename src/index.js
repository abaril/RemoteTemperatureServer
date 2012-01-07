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
var udpserver = require("./udpserver");
var temperatures = require("./temperatures");
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var awssdb = require("./awssdb");

var settings = {
	"udp_listen_port": process.env.PORT||8889, 
	"max_samples": 3000, 
	"http_listen_port": process.env.PORT||80,
	"html_directory": "html/",
	"aws_key": "aws_key",
	"aws_secret": "aws_secret"
};

winston.setLevels(winston.config.syslog.levels);
winston.add(winston.transports.File, {
	"filename": "log/server.log",
	"handleExceptions": true,
	"level": "info"
});
winston.add(winston.transports.Loggly, {
	"level": "info",
	"subdomain": "xtremelabs",
	"inputToken": "loggly_token"
});
winston.info("Settings = " + JSON.stringify(settings));

awssdb.init(settings.aws_key, settings.aws_secret);
temperatures.init(settings, awssdb.store);

udpserver.start(settings, temperatures.store);

requestHandlers.init(settings);
var handle = {}
handle["/"] = requestHandlers.index;
handle["/jquery-1.7.1.js"] = requestHandlers.jquery;
handle["/chart.js"] = requestHandlers.chart;
handle["/index.css"] = requestHandlers.css;
handle["/get_data"] = requestHandlers.get_data;
handle["/sdb_getvalue"] = requestHandlers.sdb_getvalue;

server.start(settings, router.route, handle);
