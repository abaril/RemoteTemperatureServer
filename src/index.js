var udpserver = require("./udpserver");
var temperatures = require("./temperatures");
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var settings = {"udp_listen_port": 8889, "max_samples": 10, "http_listen_port": process.env.PORT|8889};

temperatures.init(settings);

udpserver.start(settings, temperatures.store);

var handle = {}
handle["/"] = requestHandlers.start;

server.start(settings, router.route, handle);