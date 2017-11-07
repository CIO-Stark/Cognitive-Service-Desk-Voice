(function () {
    "use strict";

    module.exports = function (app, modules) {
        require("./routes/twilio")(app, modules);

        app.get("/", function (req, res) {
            res.send({
            	status: true
            });
        });
    };
}());