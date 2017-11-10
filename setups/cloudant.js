(function () {
    "use strict";
    var cloudant = require("cloudant");
    var credentials = {
        username: "b2adece0-470b-4ec5-8f44-9cc1705221f6-bluemix",
        password: "b32c8f3cafd0949f8a429d45e95fa693a4ae2940632894c8de4f93f766d8ab5f",
        host: "b2adece0-470b-4ec5-8f44-9cc1705221f6-bluemix.cloudant.com"
    };

    module.exports = cloudant({
        hostname: credentials.host,
        account: credentials.username,
        password: credentials.password
    });
}());