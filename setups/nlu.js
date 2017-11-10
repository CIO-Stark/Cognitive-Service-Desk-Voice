(function () {
    "use strict";

    var wdc_nlu = require('watson-developer-cloud/natural-language-understanding/v1.js');
    var nlu = new wdc_nlu({
        username: "3d2e5c76-6b41-4d8c-896f-56b8fa851ec0",
        password: "U86wtvvSsnAQ",
        version_date: wdc_nlu.VERSION_DATE_2016_01_23
    });

    module.exports = nlu;
}());