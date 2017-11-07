(function () {
    "use strict";
    var nlu = require('../setups/nlu');
    var nlu_features = require("../nlu_features.json");

//send text to NLU
    var processText = function(text){
        return new Promise(function(resolve, reject){
            nlu.analyze({
                'text': text,
                'features': nlu_features
            }, function (error, data) {
                if (error) {
                    reject(error);
                }
                else{
                    resolve(data);
                }
            });
        });
    };

//send url to NLU
    var processUrl = function(url){
        return new Promise(function(resolve, reject){
            nlu.analyze({
                'url': url,
                'features': nlu_features
            }, function (error, data) {
                if (error) {
                    reject(error);
                }
                else{
                    resolve(data);
                }
            });
        });
    };

    module.exports = {
        processText: processText,
        processUrl: processUrl
    };
}());