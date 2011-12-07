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
	"inputToken": "5ad40ba6-e3b6-4ab6-8682-77d7d771e623"
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
