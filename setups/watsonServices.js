(function () {
    "use strict";

    var wdc_nlu = require('watson-developer-cloud/natural-language-understanding/v1.js');
    var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');


    var nlu = new wdc_nlu({
        username: "",
        password: "",
        version_date: wdc_nlu.VERSION_DATE_2016_01_23
    });


    var text_to_speech = new TextToSpeechV1({
        username: '',
        password: ''
        });


    module.exports.nlu = nlu;
    module.exports.text_to_speech = text_to_speech; 
}());