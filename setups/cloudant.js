(function () {
    "use strict";
    var cloudant = require("cloudant");
    var credentials = {
        username: "",
        password: "",
        host: ""
    };

    module.exports = cloudant({
        hostname: credentials.host,
        account: credentials.username,
        password: credentials.password
    });
}());