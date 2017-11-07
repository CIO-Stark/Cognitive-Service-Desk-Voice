(function(scope){
    "use strict";
    require('dotenv').config({ silent: true });
    var cfenv = require("cfenv");

//middleware load
	var express = require("express");
	var http = require("http");
	var compression = require("compression");
	var cors = require("cors");
    var bodyParser = require("body-parser");
    var request = require("request-promise");
    var twilio = require("./helpers/twilio");
    var watsonServices = require("./helpers/watsonServices");

//middleware setup
	var env = cfenv.getAppEnv();
	var app = express();
	var server = http.createServer(app);

//express setup
    app.use(compression());
    app.use(cors());
	app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: "100mb" }));
    app.use(express.static('public'))

    //set routes
    require("./routes.js")(app, {
    	env: env,
        request: request,
        twilio: twilio,
        watsonServices: watsonServices
    });

//start server
    server.listen(env.port, env.bind, function () {
        console.log("running on ", env.url, env);
    });
})(this);