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
        
        var options = {
            "input": {
                "text": question
            },
            workspace_id: process.env.workspace_id,
            "context": context
        };
            
        return new Promise(function (resolve, reject) {
            if (!options) {
                return reject("Can not proceed without options object");
            }
            watsonServices.conversation.message(options, function (err, response) {
                if (err) {
          
                    console.log(err);
                    reject(err);
                } else 
                    resolve(response);
                
            });
        });
        
    };




    module.exports = {
        watsonTTS: watsonTTS,
        sendQuestion: sendQuestion
    };
}());