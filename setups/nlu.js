(function () {
    "use strict";

    var wdc_nlu = require('watson-developer-cloud/natural-language-understanding/v1.js');
    var nlu = new wdc_nlu({
        username: "",
        password: "",
        version_date: wdc_nlu.VERSION_DATE_2016_01_23
    });

    module.exports = nlu;
}());