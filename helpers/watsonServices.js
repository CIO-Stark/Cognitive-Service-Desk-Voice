(function () {
    "use strict";
    var watsonServices = require('../setups/watsonServices');
    var request = require("request-promise");
    var fs = require("fs");


    /**
     * Converts input text to local wav audio file
     * @param {*} text 
     * @param {*} id 
     */
    var watsonTTS = function(text, id){
        var params = {
            text: text,
            voice: 'pt-BR_IsabelaVoice', 
            accept: 'audio/wav'
        };
        var path = "./public/ttsAudios/"+ id +".wav";
        
        return new Promise(function(resolve, reject){
            var file = fs.createWriteStream(path);
            // Pipe the synthesized text to a file
            try{
                console.log('Processing Watson TTS for:' + text);
                watsonServices.text_to_speech.synthesize(params).pipe(file);
                file.on('finish', function() {
                    file.close();
                    resolve(id + '.wav');
                });
            }catch(err){
                reject(err);
            }
        });
    };


    /**
     * Send question to Watson Provider Middleware
     * It can be also replaced by direct API usage of Watson Conversation
     * 
     * This middleware is a running app used by the developers of this repository, that acts as a helper/middleware
     * for the Watson Conversation API
     * @param {*} question 
     * @param {*} context 
     */
    var sendQuestion = function(question, context) {
        //uri: "http://localhost:6003/askWatson?module=hr_module",
        //https://stark-dev-uradigital.mybluemix.net/askWatson?module=hr_module
        var options = {
            uri: "https://stark-dev-uradigital.mybluemix.net/askWatson?module=vivo",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: ["question=", question, "&context=", JSON.stringify(context)].join("")
        };
        console.log("options:", options);
        
        return new Promise(function(resolve, reject){
            request.post(options).then(function(data){
                resolve(JSON.parse(data));
            }).catch(function(err){
                console.error("Erro", err);
                reject(err);
            });
        });
    };

        /**
         * genesys api call
         * @param {*} question 
         * @param {*} shortLink 
         * @param {*} context 
         */
        var sendQuestionGenesys = function(question, shortLink, context) {
        var options = {
            uri: "https://watsonithelpbeta.mybluemix.net/askWatson",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: ["question=", question, "&genesys=", shortLink || true, "&context=", encodeURIComponent(JSON.stringify(context))].join("")
        };
        console.log("options:", options);
        
        return new Promise(function(resolve, reject){
            request.post(options).then(function(data){
                resolve(JSON.parse(data));
            }).catch(function(err){
                console.error("Erro", err);
                reject(err);
            });
        });
    };




    module.exports = {
        watsonTTS: watsonTTS,
        sendQuestion: sendQuestion,
        sendQuestionGenesys: sendQuestionGenesys
    };
}());