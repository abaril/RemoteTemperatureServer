var winston = require("winston");
var udpserver = require("./udpserver");
var temperatures = require("./temperatures");
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var settings = {
	"udp_listen_port": process.env.PORT||8889, 
	"max_samples": 100, 
	"http_listen_port": process.env.PORT||80
};

winston.add(winston.transports.File, {
	"filename": "log/server.log",
	"handleExceptions": true,
	"level": "info"
});
winston.info("Settings = " + JSON.stringify(settings));

temperatures.init(settings);

udpserver.start(settings, temperatures.store);

var handle = {}
handle["/"] = requestHandlers.index;
handle["/jquery-1.7.1.js"] = requestHandlers.jquery;
handle["/index.css"] = requestHandlers.css;
handle["/get_data"] = requestHandlers.get_data;

server.start(settings, router.route, handle);