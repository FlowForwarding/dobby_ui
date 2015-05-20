'use strict';

var http = require('http'),
    httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var server = http.createServer(function(req, res) {
    // You can define here your custom logic to handle the request
    // and then proxy the request.

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    if (req.method !== "OPTIONS") {
        proxy.web(req, res, { target: 'http://127.0.0.1:8080' });
    } else {
        res.end();
    }
});


module.exports.start = function(port) {
    server.listen(port || 5050);
    console.log("listening on port 5050");
};
